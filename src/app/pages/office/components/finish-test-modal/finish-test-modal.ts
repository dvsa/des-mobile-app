import {
  ModalController,
} from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'finish-test-modal',
  templateUrl: './finish-test-modal.html',
  styleUrls: ['./finish-test-modal.scss'],
})
export class FinishTestModal {

  completeTest: Function;

  constructor(
    public modalController: ModalController,
  ) {
  }

  onCompleteTest = async () => {
    await this.completeTest();
  };

  onBack = async () => {
    await this.modalController.dismiss();
  };
}
