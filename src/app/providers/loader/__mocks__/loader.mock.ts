import { Injectable } from '@angular/core';
import { LoadingOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderProviderMock {
  public handleUILoading = async (): Promise<void> => {};

  private present = async (): Promise<void> => {};

  private dismiss = async (): Promise<void> => {};

  private static get defaultLoadingOptions(): LoadingOptions {
    return {
      spinner: 'circles',
    };
  }
}
