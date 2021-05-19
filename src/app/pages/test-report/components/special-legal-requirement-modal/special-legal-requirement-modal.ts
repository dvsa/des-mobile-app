import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from '../../test-report.constants';

@Component({
  selector: 'special-legal-requirement-modal',
  templateUrl: 'special-legal-requirement-modal.html',
  styleUrls: ['special-legal-requirement-modal.scss'],
})
export class SpecialLegalRequirementModal {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  async onCancel() {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
  }

  async onTerminate() {
    await this.modalCtrl.dismiss(ModalEvent.TERMINATE);
  }
  async onProceed() {
    await this.modalCtrl.dismiss(ModalEvent.CONTINUE);
  }

}
