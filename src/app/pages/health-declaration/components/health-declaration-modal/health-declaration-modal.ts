import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'health-declaration-modal',
  templateUrl: './health-declaration-modal.html',
  styleUrls: ['./health-declaration-modal.scss'],
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
