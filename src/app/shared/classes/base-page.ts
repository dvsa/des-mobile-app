import { Platform } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { NavigationExtras, Router } from '@angular/router';

export abstract class BasePageComponent {

  protected constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
    public loginRequired: boolean = true,
  ) {

  }

  ionViewWillEnter() {
    if (this.loginRequired && this.isIos()) {
      this.authenticationProvider.hasValidToken().then(async (hasValidToken) => {
        this.authenticationProvider.determineAuthenticationMode();
        if (!hasValidToken && !this.authenticationProvider.isInUnAuthenticatedMode()) {
          await this.router.navigate(['login']);
        }
      });
    }
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
}
