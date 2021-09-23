import { ModalController, NavParams } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { SlotDetail } from '@dvsa/mes-journal-schema';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { EarlyStartDidContinue, EarlyStartDidReturn } from '@store/journal/journal.actions';
import * as moment from 'moment';

import { SetTestStatusWriteUp } from '@store/tests/test-status/test-status.actions';
import { PersistTests } from '@store/tests/tests.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Router } from '@angular/router';
import { ModalEvent } from './submit-modal.constants';

@Component({
  selector: 'submit-start-modal',
  templateUrl: './submit-modal.html',
  styleUrls: ['./submit-modal.scss'],
})
export class SubmitModal implements OnInit {
  private slotData: SlotDetail;
  @Input('testOutcome') testOutcome;
  @Input('category') category;
  @Input('candidateName') candidateName;
  @Input('slotId') slotId;

  constructor(
    public store$: Store<StoreModel>,
    public modalController: ModalController,
    private params: NavParams,
    public router: Router,
  ) {
  }

  async onTestDetailsConfirm(): Promise<void> {
    this.store$.dispatch(SetTestStatusWriteUp(this.slotId));
    this.store$.dispatch(PersistTests());
    await this.router.navigate([TestFlowPageNames.BACK_TO_OFFICE_PAGE], { replaceUrl: true });
  }

  ngOnInit(): void {
    this.slotData = this.params.get('slotData');
  }

  getSlotData() {
    return this.slotData;
  }

  onCancel = async () => {
    this.store$.dispatch(EarlyStartDidReturn());
    await this.modalController.dismiss(ModalEvent.CANCEL);
  };

  onStart = async () => {
    this.store$.dispatch(EarlyStartDidContinue());
    await this.modalController.dismiss(ModalEvent.START);
  };

  getStartTime() {
    return moment(this.slotData.start).format('kk:mm');
  }
}
