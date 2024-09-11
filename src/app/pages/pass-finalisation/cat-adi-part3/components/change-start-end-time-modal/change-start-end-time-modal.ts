import { Component } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'terminate-test-modal',
  templateUrl: './change-start-end-time-modal.html',
  styleUrls: ['./change-start-end-time-modal.scss'],
})
export class ChangeStartEndTimeModal {
  startTime = '';
  endTime = '';

  constructor(
    private modalController: ModalController,
  ) {
  }

  async onCancel() {
    await this.modalController.dismiss()
  }

  async onConfirm() {
    await this.modalController.dismiss({startTime: this.startTime, endTime: this.endTime})
  }
}
