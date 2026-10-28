import { Component } from '@angular/core';
import { IonButton, IonCard, IonCol, IonRow, IonText, ModalController } from '@ionic/angular';
import { ModalAlertTitleComponent } from '../../../../../components/common/modal-alert-title/modal-alert-title';
import { ModalEvent } from './journal-rekey-modal.constants';

@Component({
  selector: 'journal-rekey-modal',
  templateUrl: './journal-rekey-modal.html',
  styleUrls: ['./journal-rekey-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, IonButton, IonText],
})
export class JournalRekeyModal {
  constructor(private modalController: ModalController) {}

  onCancel = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.CANCEL);
  };

  onStartTest = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.START);
  };

  onRekeyTest = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.REKEY);
  };
}
