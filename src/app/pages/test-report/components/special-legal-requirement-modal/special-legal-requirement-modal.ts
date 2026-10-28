import { Component } from '@angular/core';
import { IonButton, IonCard, IonCol, IonRow, IonText, ModalController } from '@ionic/angular';
import { ModalAlertTitleComponent } from '../../../../../components/common/modal-alert-title/modal-alert-title';
import { ModalEvent } from '../../test-report.constants';

@Component({
  selector: 'special-legal-requirement-modal',
  templateUrl: 'special-legal-requirement-modal.html',
  styleUrls: ['special-legal-requirement-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, IonButton, IonText],
})
export class SpecialLegalRequirementModal {
  constructor(public modalCtrl: ModalController) {}

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
