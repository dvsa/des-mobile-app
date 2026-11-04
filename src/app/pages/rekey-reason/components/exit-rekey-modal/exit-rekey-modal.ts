import { Component } from '@angular/core';
import { IonButton, IonCard, IonCol, IonGrid, IonIcon, IonRow, IonText, ModalController } from '@ionic/angular';
import { ExitRekeyModalEvent } from './exit-rekey-modal.constants';

@Component({
  selector: 'exit-rekey-modal',
  templateUrl: 'exit-rekey-modal.html',
  styleUrls: ['exit-rekey-modal.scss'],
  imports: [IonCard, IonGrid, IonRow, IonCol, IonIcon, IonText, IonButton],
})
export class ExitRekeyModal {
  constructor(public modalCtrl: ModalController) {}

  async onCancel(): Promise<void> {
    await this.modalCtrl.dismiss(ExitRekeyModalEvent.CANCEL);
  }

  async onExitRekey(): Promise<void> {
    await this.modalCtrl.dismiss(ExitRekeyModalEvent.EXIT_REKEY);
  }
}
