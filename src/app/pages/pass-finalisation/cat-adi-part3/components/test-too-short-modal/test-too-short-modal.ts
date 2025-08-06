import { Component } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'test-too-short-modal',
  templateUrl: 'test-too-short-modal.html',
  styleUrls: ['test-too-short-modal.scss'],
  imports: [IonicModule, ComponentsModule],
  standalone: true,
})
export class TestTooShortModal {
  constructor(public modalCtrl: ModalController) {}

  clickReturn = async (): Promise<void> => {
    await this.modalCtrl.dismiss(false);
  };

  clickContinue = async (): Promise<void> => {
    await this.modalCtrl.dismiss(true);
  };
}
