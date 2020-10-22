import { BasePageComponent } from './base-page';
import { AlertController, Platform } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Router } from '@angular/router';

export abstract class LogoutBasePageComponent extends BasePageComponent {

  constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public alertController: AlertController,
    public router: Router,
    public loginRequired: boolean = true,
  ) {
    super(platform, authenticationProvider, router, loginRequired);
  }

  async openLogoutModal() {
    const alert = await this.alertController.create({
      cssClass: 'logout-modal',
      header: 'Logout?',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          },
        }, {
          text: 'Logout',
          handler: () => this.logout(),
        },
      ],
    });

    await alert.present();
  }
}
