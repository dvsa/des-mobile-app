import { Component, Input, Signal } from '@angular/core';
import { IonButton, IonCard, IonCol, IonRow, IonText, ModalController } from '@ionic/angular';

export enum LogoutModalEvent {
  LOGOUT = 'logout',
  CANCEL = 'cancel',
}

@Component({
  selector: 'logout-modal',
  templateUrl: './logout-modal.html',
  styleUrls: ['./logout-modal.scss'],
  imports: [IonCard, IonRow, IonCol, IonText, IonButton],
})
export class LogoutModal {
  constructor(public modalController: ModalController) {}

  @Input()
  unuploadedTestCount: Signal<number>;

  async onCancel() {
    await this.modalController.dismiss({ event: LogoutModalEvent.CANCEL });
  }
  async onLogout() {
    await this.modalController.dismiss({ event: LogoutModalEvent.LOGOUT });
  }
}
