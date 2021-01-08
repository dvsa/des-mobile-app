import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.store$.dispatch(LoadAppVersion());
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
