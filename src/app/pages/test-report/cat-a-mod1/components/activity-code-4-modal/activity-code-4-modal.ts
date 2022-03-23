import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalReason } from './activity-code-4-modal.constants';
import { ModalEvent } from '../../../test-report.constants';

@Component({
  selector: 'activity-code-4-modal',
  templateUrl: 'activity-code-4-modal.html',
  styleUrls: ['activity-code-4-modal.scss'],
})
export class ActivityCode4Modal {

  @Input()
  modalReason: ModalReason;

  constructor(
    private modalController: ModalController,
  ) {
  }

  async onCancel(): Promise<void> {
    await this.modalController.dismiss(ModalEvent.CANCEL);
  }

  async onEndTest(): Promise<void> {
    await this.modalController.dismiss(ModalEvent.END_WITH_ACTIVITY_CODE_4);
  }

}
