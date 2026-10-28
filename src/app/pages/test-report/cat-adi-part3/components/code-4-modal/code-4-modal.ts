import { Component } from '@angular/core';
import { IonButton, IonCard, IonCol, IonRow, ModalController } from '@ionic/angular';
import { ModalAlertTitleComponent } from '../../../../../../components/common/modal-alert-title/modal-alert-title';

@Component({
  selector: 'code-4-modal',
  templateUrl: 'code-4-modal.html',
  styleUrls: ['code-4-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, IonButton],
})
export class Code4Modal {
  constructor(private modalCtrl: ModalController) {}

  async dismiss(result: boolean): Promise<void> {
    await this.modalCtrl.dismiss(result);
  }
}
