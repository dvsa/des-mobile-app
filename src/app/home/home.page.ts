import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { BasePageComponent } from '../shared/classes/base-page';
import { LogoutProvider } from '../providers/logout/logout';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends BasePageComponent {

  constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
    public logoutProvider: LogoutProvider,
  ) {
    super(platform);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  logout() {
    this.logoutProvider.openLogoutModal();
  }

}
