import { Platform } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Router } from '@angular/router';

export abstract class BasePageComponent {

  constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
    public loginRequired: boolean = true,
  ) {

  }

  ionViewWillEnter() {
    console.log('this.loginRequired', this.loginRequired);
    console.log('isIos()', this.isIos());
    if (this.loginRequired && this.isIos()) {
      this.authenticationProvider.isAuthenticated().then(
        (isAuthenticated) => {
          console.log('isAuthenticated', isAuthenticated);
          if (!isAuthenticated) {
            console.log('guardToLogin');
            this.router.navigate(['login']);
          }
        },
      );
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
        // route to login page...
        // await this.navController.setRoot(LOGIN_PAGE, {
        //   hasLoggedOut: true,
        // });
      }
    }
  }
}
