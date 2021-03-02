import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Capacitor, Plugins, StatusBarStyle } from '@capacitor/core';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router } from '@angular/router';

import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { StoreModel } from './shared/models/store.model';
import { LoadAppVersion } from '../store/app-info/app-info.actions';
import { AuthenticationProvider } from './providers/authentication/authentication';
import { LogoutBasePageComponent } from './shared/classes/logout-base-page';
import { DataStoreProvider } from './providers/data-store/data-store';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent extends LogoutBasePageComponent implements OnInit {
  textZoom: number = 100;
  logoutEnabled: boolean = null;

  constructor(
    private store$: Store<StoreModel>,
    protected platform: Platform,
    private splashScreen: SplashScreen,
    protected authenticationProvider: AuthenticationProvider,
    protected alertController: AlertController,
    protected menuController: MenuController,
    protected secureStorage: SecureStorage,
    protected dataStore: DataStoreProvider,
    router: Router,
  ) {
    super(platform, authenticationProvider, alertController, router);
  }

  async ngOnInit() {
    await this.platform.ready();
    this.initialiseAuthentication();
    await this.initialisePersistentStorage();
    this.store$.dispatch(LoadAppVersion());
    this.splashScreen.hide();
    await this.configureStatusBar();
    await this.disableMenuSwipe();
  }

  public initialiseAuthentication = (): void => {
    this.authenticationProvider.initialiseAuthentication();
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
      // await StatusBar.setOverlaysWebView({ overlay: false });
      // await StatusBar.setBackgroundColor({ color: '#000000' });
    }
  };

  disableMenuSwipe = async (): Promise<void> => {
    await this.menuController.swipeGesture(false);
  };

  onLogoutClick = async (): Promise<void> => {
    await this.openLogoutModal();
  };

  isLogoutEnabled = (): boolean => this.authenticationProvider.logoutEnabled();
}
