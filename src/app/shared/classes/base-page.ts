import { AlertController, Platform } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { NavigationExtras, Router } from '@angular/router';

export abstract class BasePageComponent {

  protected constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public alertController: AlertController,
    public router: Router,
    public loginRequired: boolean = true,
  ) {

  }

  isIos(): boolean {
    return this.platform.is('ios');
  }


  async logout() {
    if (this.isIos()) {
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
