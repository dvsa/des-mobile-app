import {
  ModalController,
} from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-asam-failure-notification',
  templateUrl: './asam-failure-notification-modal.html',
  styleUrls: ['./asam-failure-notification-modal.scss'],
})
export class AsamFailureNotificationModal {

  constructor(
    public modalController: ModalController,
  ) {
  }

  onCompleteTest = async () => {
    await this.modalController.dismiss();
  };

}
