import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from './journal-force-check-modal.constants';

@Component({
  selector: 'journal-force-check-modal',
  templateUrl: './journal-force-check-modal.html',
  styleUrls: ['./journal-force-check-modal.scss'],
})
export class JournalForceCheckModal {

  constructor(
    private modalController: ModalController,
  ) { }

  onCancel = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.CANCEL);
  };
}
