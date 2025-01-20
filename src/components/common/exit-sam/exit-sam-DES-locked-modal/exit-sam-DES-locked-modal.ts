import { Component } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'exit-sam-DES-locked-modal',
  templateUrl: './exit-sam-DES-locked-modal.html',
  styleUrls: ['./exit-sam-DES-locked-modal.scss'],
  standalone: true,
  imports: [IonicModule, ComponentsModule],
})
export class ExitSamDESLockedModal {
  constructor(public modalController: ModalController) {}

  async onOk() {
    await this.modalController.dismiss();
  }
}
