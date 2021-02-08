import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController, NavController, NavParams, Platform,
} from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LogoutBasePageComponent } from '../../shared/classes/logout-base-page';
import { ErrorTypes } from '../../shared/models/error-message';

@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
})
export class ErrorPage extends LogoutBasePageComponent {

  public errorType: ErrorTypes;

  constructor(
    public platform: Platform,
    public navController: NavController,
    public alertController: AlertController,
    public navParams: NavParams,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
  ) {
    super(platform, authenticationProvider, alertController, router);
  }

  ngOnInit(): void {
    this.errorType = this.navParams.get('type');
  }

  goBack = (): void => {
    this.navController.pop();
  };

}
