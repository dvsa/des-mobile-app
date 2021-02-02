import { Platform } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LOGIN_PAGE } from '../../pages/page-names.constants';

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

        // TODO: Send error through the logging service

      } finally {
        const navigationExtras: NavigationExtras = {
          state: {
            hasLoggedOut: true,
          },
        };
        await this.router.navigate([LOGIN_PAGE], navigationExtras);
      }
    }
  }

}
