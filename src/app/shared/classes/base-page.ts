import { Platform } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { LOGIN_PAGE } from '@pages/page-names.constants';

export abstract class BasePageComponent {

  protected constructor(
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected router: Router,
    public loginRequired: boolean = true,
  ) {

  }

  /**
   * By calling authenticationProvider.determineAuthenticationMode(), we will set
   * authenticationProvider.inUnAuthenticatedMode to true if the user is offline.
   * This will then be used to prevent redirects to LOGIN_PAGE if the user is offline
   * Otherwise - on view entry route the user to LOGIN_PAGE if their token is invalid
   * and they are online
   //
   */
  ionViewWillEnter() {
    if (this.loginRequired && this.isIos()) {
      this.authenticationProvider.hasValidToken().then(async (hasValidToken) => {
        this.authenticationProvider.determineAuthenticationMode();
        if (!hasValidToken && !this.authenticationProvider.isInUnAuthenticatedMode()) {
          await this.router.navigate([LOGIN_PAGE]);
        }
      });
    }
  }

  isIos(): boolean {
    return this.platform.is('cordova');
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
