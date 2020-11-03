import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { AuthenticationProvider } from '../authentication/authentication';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class LogoutProvider {

  constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public alertController: AlertController,
    public router: Router,
  ) {
  }

  async logout() {
    if (this.platform.is('ios')) {
      try {
        await this.authenticationProvider.logout();
      } catch (error) {
        console.error(error);
      } finally {
        const navigationExtras: NavigationExtras = {
          state: {
            hasLoggedOut: true,
          },
        };
        await this.router.navigate(['login'], navigationExtras);
      }
    }
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
