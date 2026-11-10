import { Component } from '@angular/core';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonButton, IonCard, IonCol, IonRow, IonText, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-asam-failure-notification',
  templateUrl: './asam-failure-notification-modal.html',
  styleUrls: ['./asam-failure-notification-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, IonButton, IonText],
})
export class AsamFailureNotificationModal {
  constructor(public modalController: ModalController) {}

  onCompleteTest = async () => {
    await this.modalController.dismiss();
  };
}
