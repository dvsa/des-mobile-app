import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from '../../test-report.constants';

@Component({
  selector: 'end-test-modal',
  templateUrl: 'end-test-modal.html',
  styleUrls: ['end-test-modal.scss'],
})
export class EndTestModal {

  constructor(
    private modalCtrl: ModalController,
  ) {}

  async onCancel() {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
  }

  async onContinue() {
    await this.modalCtrl.dismiss(ModalEvent.CONTINUE);
  }

  async onTerminate() {
    await this.modalCtrl.dismiss(ModalEvent.TERMINATE);
  }

}
