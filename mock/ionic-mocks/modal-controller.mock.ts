import { Injectable } from '@angular/core';

@Injectable()
export class ModalControllerMock {

  create(opts?: any): Promise<HTMLIonModalElement> {
    return Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve(true),
    } as HTMLIonModalElement);
  }

  dismiss = () => Promise.resolve(false);

}
