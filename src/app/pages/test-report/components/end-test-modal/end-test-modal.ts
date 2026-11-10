import { Component } from '@angular/core';
import { IonButton, IonCard, IonCol, IonRow, IonText, ModalController } from '@ionic/angular';
import { ModalEvent } from '../../test-report.constants';

@Component({
  selector: 'end-test-modal',
  templateUrl: 'end-test-modal.html',
  styleUrls: ['end-test-modal.scss'],
  imports: [IonCard, IonRow, IonCol, IonText, IonButton],
})
export class EndTestModal {
  constructor(public modalCtrl: ModalController) {}

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
