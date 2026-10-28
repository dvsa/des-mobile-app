import { Component, Input } from '@angular/core';
import { IonButton, IonCard, IonCol, IonRow, ModalController } from '@ionic/angular';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import { ModalAlertTitleComponent } from '../../../../../../components/common/modal-alert-title/modal-alert-title';
import { ModalReturnButtonComponent } from '../../../../../../components/common/modal-return-button/modal-return-button';
import { ModalEvent } from '../../../test-report.constants';

@Component({
  selector: 'speed-check-modal',
  templateUrl: 'speed-check-modal.html',
  styleUrls: ['speed-check-modal.scss'],
  imports: [IonCard, ModalAlertTitleComponent, IonRow, IonCol, ModalReturnButtonComponent, IonButton],
})
export class SpeedCheckModal {
  @Input()
  speedChecksNeedCompleting: competencyLabels[];

  constructor(private modalController: ModalController) {}

  async onCancel(): Promise<void> {
    await this.modalController.dismiss(ModalEvent.CANCEL);
  }

  async onTerminate(): Promise<void> {
    await this.modalController.dismiss(ModalEvent.TERMINATE);
  }
}
