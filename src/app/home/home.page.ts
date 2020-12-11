import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { BasePageComponent } from '../shared/classes/base-page';
import { AuthenticationProvider } from '../providers/authentication/authentication';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends BasePageComponent {

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    private alertController: AlertController,
  ) {
    super(platform, authenticationProvider, router);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  onLogout() {
    this.openLogoutModal();
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
