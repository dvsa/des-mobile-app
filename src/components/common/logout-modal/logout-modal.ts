import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

export enum LogoutModalEvent {
  LOGOUT = 'logout',
  CANCEL = 'cancel',
}

@Component({
  selector: 'logout-modal',
  templateUrl: './logout-modal.html',
  styleUrls: ['./logout-modal.scss'],
})
export class LogoutModal {
  constructor(public modalController: ModalController) {}

  @Input()
  unsubmittedCount: number;

  async onCancel() {
    await this.modalController.dismiss({ event: LogoutModalEvent.CANCEL });
  }
  async onLogout() {
    await this.modalController.dismiss({ event: LogoutModalEvent.LOGOUT });
  }
}
