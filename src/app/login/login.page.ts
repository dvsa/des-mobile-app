import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public loadingController: LoadingController,
    public platform: Platform,
  ) { }

  ngOnInit() {
  }

  isUserNotAuthorised = (): boolean => {
    return true;
  }

  login = async (): Promise<any> => {
    await this.handleLoadingUI(true);
    console.log('loginClicked');

    try {
      await this.platform.ready();

      await this.handleLoadingUI(false);
    } catch (error) {

      await this.handleLoadingUI(false);
    }
  }

  async handleLoadingUI(isLoading: boolean): Promise<void> {
    if (isLoading) {
      await this.loadingController.create({
        spinner: 'circles',
        message: 'App initialising...',
      }).then(result => {
        result.present();
      });
      return;
    }
    await this.loadingController.dismiss();
  }

}
