import { Component, Input } from '@angular/core';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonButton, IonCard, IonCol, IonRow, ModalController } from '@ionic/angular';

export enum UpdateAvailable {
  REMIND_ME_LATER = 'Remind me later',
  OK = 'Ok',
}

@Component({
  selector: 'update-available-modal',
  templateUrl: 'update-available-modal.html',
  styleUrls: ['update-available-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, IonButton],
})
export class UpdateAvailableModal {
  @Input()
  appVersion: string;

  constructor(private modalCtrl: ModalController) {}

  clickRemindMeLater = async (): Promise<void> => {
    await this.modalCtrl.dismiss(UpdateAvailable.REMIND_ME_LATER);
  };

  clickOK = async (): Promise<void> => {
    await this.modalCtrl.dismiss(UpdateAvailable.OK);
  };
}
