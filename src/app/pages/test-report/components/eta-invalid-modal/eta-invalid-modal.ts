import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from '../../test-report.constants';

@Component({
  selector: 'eta-invalid-modal',
  templateUrl: 'eta-invalid-modal.html',
  styleUrls: ['eta-invalid-modal.scss'],
})
export class EtaInvalidModal {
  constructor(private modalCtrl: ModalController) {}

  async onCancel() {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
  }
}
