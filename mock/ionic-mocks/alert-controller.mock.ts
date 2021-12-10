import { AlertOptions } from '@ionic/core';

export class AlertControllerMock {

  create(options: AlertOptions): Promise<HTMLIonAlertElement> {
    return Promise.resolve({
      present: () => Promise.resolve(),
    } as HTMLIonAlertElement);
  }

  dismiss = () => Promise.resolve(true);

  getTop(): Promise<HTMLIonAlertElement | undefined> {
    return Promise.resolve({} as HTMLIonAlertElement);
  }

}
