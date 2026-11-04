import { Component, Input } from '@angular/core';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonButton, IonCard, IonCol, IonRow, IonText, ModalController } from '@ionic/angular';

@Component({
  selector: 'exit-sam-error-modal',
  templateUrl: './exit-sam-error-modal.html',
  styleUrls: ['./exit-sam-error-modal.scss'],
  imports: [IonRow, IonCol, IonText, IonCard, IonButton, ModalAlertTitleComponent],
})
export class ExitSamErrorModal {
  @Input() firstMessage: string;
  @Input() secondMessage?: string;
  @Input() modalTitle: string;

  constructor(public modalController: ModalController) {}

  async onOk() {
    await this.modalController.dismiss();
  }
}
