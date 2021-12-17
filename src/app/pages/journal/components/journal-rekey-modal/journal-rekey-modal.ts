import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from './journal-rekey-modal.constants';

@Component({
  selector: 'journal-rekey-modal',
  templateUrl: './journal-rekey-modal.html',
  styleUrls: ['./journal-rekey-modal.scss'],
})
export class JournalRekeyModal {

  constructor(
    private modalController: ModalController,
  ) {}

  onCancel = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.CANCEL);
  };

  onStartTest = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.START);
  };

  onRekeyTest = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.REKEY);
  };

}
