import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Capacitor, Plugins, StatusBarStyle } from '@capacitor/core';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { Observable, merge, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { StoreModel } from '@shared/models/store.model';
import { LogoutBasePageComponent } from '@shared/classes/logout-base-page';
import { LoadAppVersion, AppResumed, AppSuspended } from '@store/app-info/app-info.actions';
import { selectLogoutEnabled } from '@store/app-config/app-config.selectors';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent extends LogoutBasePageComponent implements OnInit {
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
    public accessibilityService: AccessibilityService,
    router: Router,
  ) {
    super(platform, authenticationProvider, alertController, router);
  }

  async ngOnInit() {
    await this.platform.ready();
    this.initialiseNetworkState();
    this.initialiseAuthentication();
    await this.initialisePersistentStorage();
    this.store$.dispatch(LoadAppVersion());
    await this.hideSplashscreen();
    await this.configureStatusBar();
    this.configureLocale();
    if (this.platform.is('cordova')) {
      this.accessibilityService.configureAccessibility();
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

        return Promise.resolve();
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
    this.accessibilityService.afterAppResume();
  };

  onAppSuspended = (): void => {
    this.store$.dispatch(AppSuspended());
  };

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
