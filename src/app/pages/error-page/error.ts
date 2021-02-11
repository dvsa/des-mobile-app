import { Component, Input } from '@angular/core';
import {
  AlertController, NavParams, Platform,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LogoutBasePageComponent } from '../../shared/classes/logout-base-page';
import { ErrorTypes } from '../../shared/models/error-message';

@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
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
    public location: Location,
  ) {
    super(platform, authenticationProvider, alertController, router);
  }

  goBack = (): void => {
    this.location.back();
  };

}
