import { Component, Input } from '@angular/core';
import {
  AlertController, ModalController, NavParams, Platform,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { LogoutBasePageComponent } from '@shared/classes/logout-base-page';
import { ErrorTypes } from '@shared/models/error-message';

@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
  styleUrls: ['error.scss'],
})
export class ErrorPage extends LogoutBasePageComponent {

  @Input()
  public errorType: ErrorTypes;

  constructor(
    public platform: Platform,
    public alertController: AlertController,
    public navParams: NavParams,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
    public modalController: ModalController,
  ) {
    super(platform, authenticationProvider, alertController, router);
  }

  async dismiss(): Promise<void> {
    await this.modalController.dismiss();
  }

}
