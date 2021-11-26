/* eslint no-await-in-loop: 0 */
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingProvider {

  private loader: HTMLIonLoadingElement;

  constructor(private loadingCtrl: LoadingController) {}

  public handleUILoading = async (isLoading: boolean, loadingOpts: LoadingOptions = null): Promise<void> => {
    console.log('spinner action', isLoading);
    if (isLoading) {
      await this.present(loadingOpts);
      return;
    }
    console.log('im gonna dismiss');
    await this.dismiss();
  };

  private present = async (loadingOpts: LoadingOptions = null): Promise<void> => {
    if (!loadingOpts) loadingOpts = LoadingProvider.defaultLoadingOptions;

    this.loader = await this.loadingCtrl.create(loadingOpts);
    await this.loader.present();
  };

  private dismiss = async (): Promise<void> => {
    let topLoader: HTMLIonLoadingElement = await this.loadingCtrl.getTop();

    while (topLoader) {
      if (!(await topLoader.dismiss())) {
        console.log('dismiss');
        break;
      }
      topLoader = await this.loadingCtrl.getTop();
    }
  };

  private static get defaultLoadingOptions(): LoadingOptions {
    return {
      spinner: 'circles',
    };
  }
}
