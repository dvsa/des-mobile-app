import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import { ModalEvent } from '../../../test-report.constants';

@Component({
  selector: 'speed-check-modal',
  templateUrl: 'speed-check-modal.html',
  styleUrls: ['speed-check-modal.scss'],
})
export class SpeedCheckModal {

  @Input()
  speedChecksNeedCompleting: competencyLabels[];

  constructor(
    private modalController: ModalController,
  ) {
  }

  async onCancel(): Promise<void> {
    await this.modalController.dismiss(ModalEvent.CANCEL);
  }

  async onTerminate(): Promise<void> {
    await this.modalController.dismiss(ModalEvent.TERMINATE);
  }

}
