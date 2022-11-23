import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { StatusBar, Style } from '@capacitor/status-bar';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SecureStorage } from '@awesome-cordova-plugins/secure-storage/ngx';
import { Observable, merge, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as Sentry from '@sentry/capacitor';
import { init as sentryAngularInit } from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { StoreModel } from '@shared/models/store.model';
import { LogoutBasePageComponent } from '@shared/classes/logout-base-page';
import { LoadAppVersion, AppResumed, AppSuspended } from '@store/app-info/app-info.actions';
import { selectLogoutEnabled } from '@store/app-config/app-config.selectors';
import { Capacitor } from '@capacitor/core';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { SENTRY_ERRORS } from '@app/sentry-error-handler';
import { DeviceProvider } from '@providers/device/device';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent extends LogoutBasePageComponent implements OnInit {
  textZoom: number = 100;
  logoutEnabled$: Observable<boolean>;

  private platformSubscription: Subscription;

  constructor(
    private store$: Store<StoreModel>,
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected alertController: AlertController,
    protected menuController: MenuController,
    protected secureStorage: SecureStorage,
    protected dataStore: DataStoreProvider,
    protected networkStateProvider: NetworkStateProvider,
    protected translate: TranslateService,
    protected appInfo: AppInfoProvider,
    protected appConfigProvider: AppConfigProvider,
    protected deviceProvider: DeviceProvider,
    router: Router,
  ) {
    super(platform, authenticationProvider, alertController, router);
  }

  async ngOnInit() {
    await this.platform.ready();
    if (this.platform.is('cordova')) {
      await this.deviceProvider.disableSingleAppMode();
    }
    await this.appConfigProvider.initialiseAppConfig();
    await this.initialiseSentry();
    this.initialiseNetworkState();
    this.initialiseAuthentication();
    await this.initialisePersistentStorage();
    this.store$.dispatch(LoadAppVersion());
    await this.configureStatusBar();
    this.configureLocale();
    if (this.platform.is('cordova')) {
      this.configureAccessibility();
      this.configurePlatformSubscriptions();
    }
    await this.disableMenuSwipe();
    this.logoutEnabled$ = this.store$.select(selectLogoutEnabled);
  }

  ionViewWillUnload() {
    if (this.platformSubscription) {
      this.platformSubscription.unsubscribe();
    }
  }

  public initialiseAuthentication = (): void => {
    this.authenticationProvider.initialiseAuthentication();
    this.authenticationProvider.determineAuthenticationMode();
  };

  public initialiseNetworkState = (): void => {
    this.networkStateProvider.initialiseNetworkState();
  };

  async initialisePersistentStorage(): Promise<void> {
    if (this.isIos()) {
      try {
        const storage = await this.secureStorage.create('DES');
        this.dataStore.setSecureContainer(storage);

        return await Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }

  configurePlatformSubscriptions(): void {
    const merged$ = merge(
      this.platform.resume.pipe(
        map(this.onAppResumed),
      ),
      this.platform.pause.pipe(
        map(this.onAppSuspended),
      ),
    );
    this.platformSubscription = merged$.subscribe();
  }

  onAppResumed = (): void => {
    this.store$.dispatch(AppResumed());
    window.MobileAccessibility.usePreferredTextZoom(true);
    window.MobileAccessibility.getTextZoom(this.getTextZoomCallback);
  };

  onAppSuspended = (): void => {
    this.store$.dispatch(AppSuspended());
  };

  configureAccessibility = (): void => {
    window.MobileAccessibility.updateTextZoom();
    window.MobileAccessibility.getTextZoom(this.getTextZoomCallback);
  };

  getTextZoomCallback = (zoomLevel: number): void => {
    // Default iOS zoom levels are: 88%, 94%, 100%, 106%, 119%, 131%, 144% - 106% is default / normal zoom for ipad
    this.textZoom = zoomLevel;
    window.MobileAccessibility.usePreferredTextZoom(false);
  };

  public getTextZoom(zoom: number): string {
    if (!zoom) return 'regular';
    if (zoom >= 131) return 'x-large';
    if (zoom >= 106) return 'large';
    return 'regular';
  }

  public getTextZoomClass(): string {
    return `text-zoom-${this.getTextZoom(this.textZoom)}`;
  }

  configureStatusBar = async (): Promise<void> => {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      await StatusBar.setStyle({ style: Style.Dark });
    }
  };

  disableMenuSwipe = async (): Promise<void> => {
    await this.menuController.swipeGesture(false);
  };

  onLogoutClick = async (): Promise<void> => {
    await this.openLogoutModal();
  };

  configureLocale(): void {
    this.translate.setDefaultLang('en');
  }

  initialiseSentry = async () => {
    // don't run sentry in browser;
    if (!this.platform.is('cordova')) return;

    const appVersion: string = await this.appInfo.getFullVersionNumber();

    const { sentry } = this.appConfigProvider.getAppConfig();

    Sentry.init({
      dsn: sentry?.dsn,
      enabled: !!sentry?.dsn,
      environment: sentry?.environment,
      release: `des@${appVersion}`,
      dist: appVersion,
      tracesSampleRate: 0.05,
      integrations: [new BrowserTracing()],
      ignoreErrors: SENTRY_ERRORS,
    }, sentryAngularInit);

    return Promise.resolve();
  };

}
