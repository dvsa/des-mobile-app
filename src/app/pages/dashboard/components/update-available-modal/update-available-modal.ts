import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

export enum UpdateAvailable {
  REMIND_ME_LATER = 'Remind me later',
  OK = 'Ok',
}

@Component({
  selector: 'update-available-modal',
  templateUrl: 'update-available-modal.html',
  styleUrls: ['update-available-modal.scss'],
})
export class UpdateAvailableModal {

  @Input()
  appVersion: string;

  constructor(private modalCtrl: ModalController) {
  }

  clickRemindMeLater = async (): Promise<void> => {
    await this.modalCtrl.dismiss(UpdateAvailable.REMIND_ME_LATER);
  };

  clickOK = async (): Promise<void> => {
    await this.modalCtrl.dismiss(UpdateAvailable.OK);
  };

}
