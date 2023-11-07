import { AlertController } from '@ionic/angular';
import { BasePageComponent } from './base-page';
import { Injector } from '@angular/core';

export abstract class LogoutBasePageComponent extends BasePageComponent {
  protected alertController = this.injector.get(AlertController);

  protected constructor(injector: Injector) {
    super(injector);
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
