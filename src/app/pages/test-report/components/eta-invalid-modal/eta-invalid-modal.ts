import { Component } from '@angular/core';
import { IonCard, IonCol, IonRow, ModalController } from '@ionic/angular';
import { ModalAlertTitleComponent } from '../../../../../components/common/modal-alert-title/modal-alert-title';
import { ModalReturnButtonComponent } from '../../../../../components/common/modal-return-button/modal-return-button';
import { ModalEvent } from '../../test-report.constants';

@Component({
  selector: 'eta-invalid-modal',
  templateUrl: 'eta-invalid-modal.html',
  styleUrls: ['eta-invalid-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, ModalReturnButtonComponent],
})
export class EtaInvalidModal {
  constructor(public modalCtrl: ModalController) {}

  async onCancel() {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
  }
}
