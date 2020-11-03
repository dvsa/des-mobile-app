import { Platform } from '@ionic/angular';

export abstract class BasePageComponent {

  protected constructor(
    public platform: Platform,
  ) {

  }

  isIos(): boolean {
    return this.platform.is('ios');
  }

}
