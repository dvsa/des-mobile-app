import { AlertController } from '@ionic/angular';
import { AlertOptions } from '@capacitor/core';

export class AlertControllerMock extends AlertController {

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
