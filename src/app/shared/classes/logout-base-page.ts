import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { BasePageComponent } from './base-page';

export abstract class LogoutBasePageComponent extends BasePageComponent {

  constructor(
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected alertController: AlertController,
    router: Router,
  ) {
    super(platform, authenticationProvider, router);
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
