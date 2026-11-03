import { Component } from '@angular/core';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonButton, IonCard, IonCol, IonRow, IonText, ModalController } from '@ionic/angular';
import { ModalEvent } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal.constants';

@Component({
  selector: 'preview-mode-start-modal',
  templateUrl: './preview-mode-modal.html',
  styleUrls: ['./preview-mode-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, IonButton, IonText],
})
export class PreviewModeModal {
  constructor(public modalController: ModalController) {}

  onCancel = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.CANCEL);
  };

  onContinue = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.START);
  };
}
