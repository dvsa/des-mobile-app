import { Component } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'exit-sam-practice-mode-modal',
  templateUrl: './exit-sam-practice-mode-modal.html',
  styleUrls: ['./exit-sam-practice-mode-modal.scss'],
  standalone: true,
  imports: [IonicModule, ComponentsModule],
})
export class ExitSamPracticeModeModal {
  constructor(public modalController: ModalController) {}

  async onOk() {
    await this.modalController.dismiss();
  }
}
