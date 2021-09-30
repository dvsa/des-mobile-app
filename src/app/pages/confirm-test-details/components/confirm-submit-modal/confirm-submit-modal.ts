import {
  ModalController,
} from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'confirm-submit-modal',
  templateUrl: './confirm-submit-modal.html',
  styleUrls: ['./confirm-submit-modal.scss'],
})
export class ConfirmSubmitModal {

  onTestDetailsConfirm: Function;
  testOutcome: string;
  category: string;
  candidateName: string;

  constructor(
    public modalController: ModalController,
  ) {
  }

  onCompleteTest = async () => {
    await this.modalController.dismiss();
    await this.onTestDetailsConfirm();
  };

  onBack = async () => {
    await this.modalController.dismiss();
  };
}
