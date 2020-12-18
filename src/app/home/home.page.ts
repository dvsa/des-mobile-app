import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { BasePageComponent } from '../shared/classes/base-page';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { StoreModel } from '../../types/store.model';
import { selectVersionNumber } from '../../store/app-info/app-info.selectors';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends BasePageComponent {

  appVersion$: Observable<string>;

  constructor(
    private store$: Store<StoreModel>,
    private alertController: AlertController,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
  ) {
    super(platform, authenticationProvider, router);
  }

  ngOnInit() {
    this.appVersion$ = this.store$.select(selectVersionNumber);
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
