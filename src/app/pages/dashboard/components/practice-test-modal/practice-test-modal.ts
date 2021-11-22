import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from '@pages/dashboard/components/practice-test-modal/practice-test-modal.constants';

@Component({
  selector: 'practice-test-modal',
  templateUrl: 'practice-test-modal.html',
  styleUrls: ['practice-test-modal.scss'],
})
export class PracticeTestModal {

  constructor(
    public modalController: ModalController,
  ) {}

  onCancel = async () => {
    await this.modalController.dismiss(ModalEvent.CANCEL);
  };

  onNoFault = async () => {
    await this.modalController.dismiss(ModalEvent.NO_FAULT);
  };

  onFault = async () => {
    await this.modalController.dismiss(ModalEvent.FAULT);
  };

}
