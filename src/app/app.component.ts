import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Capacitor, Plugins, StatusBarStyle } from '@capacitor/core';
import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router } from '@angular/router';

import { StoreModel } from './shared/models/store.model';
import { LoadAppVersion } from '../store/app-info/app-info.actions';
import { AuthenticationProvider } from './providers/authentication/authentication';
import { LogoutBasePageComponent } from './shared/classes/logout-base-page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent extends LogoutBasePageComponent {
  textZoom: number = 100;

  constructor(
    private store$: Store<StoreModel>,
    protected platform: Platform,
    private splashScreen: SplashScreen,
    protected authenticationProvider: AuthenticationProvider,
    protected alertController: AlertController,
    router: Router,
  ) {
    super(platform, authenticationProvider, alertController, router);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.store$.dispatch(LoadAppVersion());
      this.splashScreen.hide();
      await this.configureStatusBar();
    });
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
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setBackgroundColor({ color: '#000000' });
    }
  };

  onLogoutClick = async (): Promise<void> => {
    await this.openLogoutModal();
  };

  isLogoutEnabled = (): boolean => this.authenticationProvider.logoutEnabled();
}
