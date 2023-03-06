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

  async dismiss(result: boolean): Promise<void> {
    await this.modalCtrl.dismiss(result);
  }
}
