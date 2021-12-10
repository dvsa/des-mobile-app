import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Capacitor, Plugins, StatusBarStyle } from '@capacitor/core';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { merge, Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { StoreModel } from '@shared/models/store.model';
import { LogoutBasePageComponent } from '@shared/classes/logout-base-page';
import { AppResumed, AppSuspended, LoadAppVersion } from '@store/app-info/app-info.actions';
import { selectLogoutEnabled } from '@store/app-config/app-config.selectors';

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
    protected dataStore: DataStoreProvider,
    protected networkStateProvider: NetworkStateProvider,
    protected translate: TranslateService,
    router: Router,
  ) {
    super(platform, authenticationProvider, alertController, router);
  }

  async ngOnInit() {
    await this.platform.ready();
    this.initialiseNetworkState();
    this.initialiseAuthentication();
    this.store$.dispatch(LoadAppVersion());
    await this.hideSplashscreen();
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
    this.dataStore.initialiseVault();
    this.authenticationProvider.initialiseAuthentication();
    this.authenticationProvider.determineAuthenticationMode();
  };

  public initialiseNetworkState = (): void => {
    this.networkStateProvider.initialiseNetworkState();
  };

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
      const { StatusBar } = Plugins;
      await StatusBar.setStyle({ style: StatusBarStyle.Dark });
    }
  };

  hideSplashscreen = async (): Promise<void> => {
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      const { SplashScreen } = Plugins;
      await SplashScreen.hide();
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

}
