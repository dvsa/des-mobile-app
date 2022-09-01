import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'code-4-modal',
  templateUrl: 'code-4-modal.html',
  styleUrls: ['code-4-modal.scss'],
})
export class Code4Modal {
  constructor(
    private modalCtrl: ModalController,
  ) {}

  dismiss(result: boolean) {
    this.modalCtrl.dismiss(result);
  }
}
