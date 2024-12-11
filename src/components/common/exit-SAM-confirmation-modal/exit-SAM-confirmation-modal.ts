import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

export enum ExitSAMModalEvent {
  EXIT = 'exit',
  CANCEL = 'cancel',
}

@Component({
  selector: 'exit-SAM-confirmation-modal',
  templateUrl: './exit-SAM-confirmation-modal.html',
  styleUrls: ['./exit-SAM-confirmation-modal.scss'],
})
export class ExitSAMConfirmationModal {
  constructor(public modalController: ModalController) {}

  async onCancel() {
    await this.modalController.dismiss({ event: ExitSAMModalEvent.CANCEL });
  }
  async onExit() {
    await this.modalController.dismiss({ event: ExitSAMModalEvent.EXIT });
  }
}
