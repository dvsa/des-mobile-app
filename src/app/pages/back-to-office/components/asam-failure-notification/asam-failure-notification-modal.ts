import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-asam-failure-notification',
  templateUrl: './asam-failure-notification-modal.html',
  styleUrls: ['./asam-failure-notification-modal.scss'],
})
export class AsamFailureNotificationModal {
  constructor(public modalController: ModalController) {}

  onCompleteTest = async () => {
    await this.modalController.dismiss();
  };
}
