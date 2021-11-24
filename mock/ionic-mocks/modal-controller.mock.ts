import { Injectable } from '@angular/core';
import {ModalOptions, OverlayEventDetail} from '@ionic/core';

@Injectable()
export class ModalControllerMock {

  dismiss = () => Promise.resolve(false);

  create(opts?: ModalOptions): Promise<HTMLIonModalElement> {
    return Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve(true),
      onDidDismiss: () => Promise.resolve({} as OverlayEventDetail),
    } as HTMLIonModalElement);
  }
}
