import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'end-test-modal',
  templateUrl: 'records-explanation-modal.html',
  styleUrls: ['records-explanation-modal.scss'],
})
export class RecordsExplanationModal {
  constructor(public modalCtrl: ModalController) {}

  async onDismiss() {
    await this.modalCtrl.dismiss();
  }
}
