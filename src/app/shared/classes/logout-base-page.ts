import { AlertController, Platform } from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { inject } from '@angular/core';
import { BasePageComponent } from './base-page';

export abstract class LogoutBasePageComponent extends BasePageComponent {
  protected platform = inject(Platform);
  protected authenticationProvider = inject(AuthenticationProvider);
  protected alertController = inject(AlertController);

  protected constructor() {
    super();
  }

  async openLogoutModal() {
    const alert = await this.alertController.create({
      header: 'Logout?',
      message: 'Are you sure you want to logout?',
      cssClass: 'logout-modal',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          },
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
