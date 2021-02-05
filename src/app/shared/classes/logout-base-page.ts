import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { BasePageComponent } from './base-page';
import { LogHelper } from '../../providers/logs/logs-helper';
import { StoreModel } from '../models/store.model';

export abstract class LogoutBasePageComponent extends BasePageComponent {

  constructor(
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected alertController: AlertController,
    protected router: Router,
    protected logHelper: LogHelper,
    protected store$: Store<StoreModel>,
  ) {
    super(platform, authenticationProvider, router, store$, logHelper);
  }

  async openLogoutModal() {
    const alert = await this.alertController.create({
      header: 'Logout?',
      message: 'Are you sure you want to logout?',
      cssClass: 'logout-modal',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { },
        },
        {
          text: 'Logout',
          handler: () => this.logout(),
        },
      ],
    });

    await alert.present();
  }

}
