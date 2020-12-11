import { Platform } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

export abstract class BasePageComponent {

  protected constructor(
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected router: Router,
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

}
