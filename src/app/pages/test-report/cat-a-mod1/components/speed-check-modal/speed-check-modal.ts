import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ReturnToTest } from '@pages/test-report/test-report.actions';
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
    private store$: Store<StoreModel>,
  ) {
  }

  async onCancel(): Promise<void> {
    await this.modalController.dismiss(ModalEvent.CANCEL);
    this.store$.dispatch(ReturnToTest());
  }

  async onTerminate(): Promise<void> {
    await this.modalController.dismiss(ModalEvent.TERMINATE);
  }

}
