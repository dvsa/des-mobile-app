import { Injectable } from '@angular/core';

@Injectable()
export class LoadingControllerMock {

  create(opts?: any): Promise<HTMLIonLoadingElement> {
    return Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve(true),
    } as HTMLIonLoadingElement);
  }

  dismiss = () => Promise.resolve(true);

  getTop(): Promise<HTMLIonLoadingElement | undefined> {
    return Promise.resolve({} as HTMLIonLoadingElement);
  }

}
