import { Injectable } from '@angular/core';
import { ModalOptions, OverlayEventDetail}  from '@ionic/core';

@Injectable()
export class ToastControllerMock {

    dismiss = () => Promise.resolve(false);

    create(opts?: ModalOptions): Promise<HTMLIonToastElement> {
        return Promise.resolve({
            present: () => Promise.resolve(),
            dismiss: () => Promise.resolve(true),
            onDidDismiss: () => Promise.resolve({} as OverlayEventDetail),
        } as HTMLIonToastElement);
    }

    getTop = () => Promise.resolve({} as HTMLIonToastElement);
}
