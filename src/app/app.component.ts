import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Plugins, StatusBarStyle } from '@capacitor/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { StoreModel } from './shared/models/store.model';
import { LoadAppVersion } from '../store/app-info/app-info.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private store$: Store<StoreModel>,
    private platform: Platform,
    private splashScreen: SplashScreen,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.store$.dispatch(LoadAppVersion());
      this.splashScreen.hide();
      this.configureStatusBar();
    });
  }

  configureStatusBar() {
    Plugins.StatusBar.setStyle({
      style: StatusBarStyle.Dark,
    });
  }
}
