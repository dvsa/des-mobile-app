import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal.constants';

export enum PracticeModeMOTType {
  FAILED = 'fail',
  PASS = 'pass',
  NO_DETAILS = 'no details',
}

@Component({
  selector: 'practice-mode-mot-modal',
  templateUrl: './practice-mode-mot-modal.component.html',
  styleUrls: ['./practice-mode-mot-modal.component.scss'],
})
export class PracticeModeMOTModal {

  constructor(public modalCtrl: ModalController) {}

  async onConfirm(type: PracticeModeMOTType) {
    await this.modalCtrl.dismiss(type);
  }
  onCancel = async (): Promise<void> => {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
  };
  protected readonly PracticeModeMOTType = PracticeModeMOTType;
}
