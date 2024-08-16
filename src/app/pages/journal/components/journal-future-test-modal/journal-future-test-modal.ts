import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal.constants';

@Component({
  selector: 'journal-rekey-modal',
  templateUrl: './journal-future-test-modal.html',
  styleUrls: ['./journal-future-test-modal.scss'],
})
export class JournalFutureTestModal {
  constructor(private modalController: ModalController) {}

  onCancel = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.CANCEL);
  };

  onStartTest = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.START);
  };
}
