
import { Component, Input } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'exit-sam-error-modal',
  templateUrl: './exit-sam-error-modal.html',
  styleUrls: ['./exit-sam-error-modal.scss'],
  imports: [IonicModule, ComponentsModule],
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
