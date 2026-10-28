import { Component } from '@angular/core';
import { IonButton, IonCard, IonCol, IonRow, ModalController } from '@ionic/angular';
import { ModalAlertTitleComponent } from '../../../../../components/common/modal-alert-title/modal-alert-title';

@Component({
  selector: 'finish-test-modal',
  templateUrl: './finish-test-modal.html',
  styleUrls: ['./finish-test-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, IonButton],
})
export class FinishTestModal {
  completeTest: Function;

  destroyTestSubs: Function;

  constructor(public modalController: ModalController) {}

  onCompleteTest = async () => {
    this.destroyTestSubs();
    await this.completeTest();
  };

  onBack = async () => {
    await this.modalController.dismiss();
  };
}
