import { Component } from '@angular/core';
import { IonButton, IonCard, IonCol, IonRow, ModalController } from '@ionic/angular';
import { ModalAlertTitleComponent } from '../../../../../components/common/modal-alert-title/modal-alert-title';

@Component({
  selector: 'health-declaration-modal',
  templateUrl: './health-declaration-modal.html',
  styleUrls: ['./health-declaration-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, IonButton],
})
export class HealthDeclarationModal {
  onTestDetailsConfirm: Function;

  licenseProvided: boolean;

  constructor(public modalController: ModalController) {}

  onCompleteTest = async () => {
    await this.modalController.dismiss();
    await this.onTestDetailsConfirm();
  };

  onBack = async () => {
    await this.modalController.dismiss();
  };
}
