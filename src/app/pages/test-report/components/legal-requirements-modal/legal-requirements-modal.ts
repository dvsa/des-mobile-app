import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { ModalReturnButtonComponent } from '@components/common/modal-return-button/modal-return-button';
import { IonButton, IonCard, IonCol, IonRow, IonText, ModalController } from '@ionic/angular';
import { legalRequirementsLabels } from '@shared/constants/legal-requirements/legal-requirements.constants';
import { ModalEvent } from '../../test-report.constants';

@Component({
  selector: 'legal-requirements-modal',
  templateUrl: 'legal-requirements-modal.html',
  styleUrls: ['legal-requirements-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, ModalReturnButtonComponent, IonButton, IonText, NgClass],
})
export class LegalRequirementsModal {
  @Input()
  legalRequirements: legalRequirementsLabels[];
  @Input()
  isDelegated: boolean;

  constructor(private modalCtrl: ModalController) {
    if (this.isDelegated === null) {
      this.isDelegated = false;
    }
  }

  async onContinue() {
    await this.modalCtrl.dismiss(ModalEvent.CONTINUE);
  }

  async onCancel() {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
  }

  async onTerminate() {
    await this.modalCtrl.dismiss(ModalEvent.TERMINATE);
  }
}
