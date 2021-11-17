import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExitRekeyModalEvent } from './exit-rekey-modal.constants';

@Component({
  selector: 'exit-rekey-modal',
  templateUrl: 'exit-rekey-modal.html',
  styleUrls: ['exit-rekey-modal.scss'],
})
export class ExitRekeyModal {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  async onCancel(): Promise<void> {
    await this.modalCtrl.dismiss(ExitRekeyModalEvent.CANCEL);
  }

  async onExitRekey(): Promise<void> {
    await this.modalCtrl.dismiss(ExitRekeyModalEvent.EXIT_REKEY);
  }

}
