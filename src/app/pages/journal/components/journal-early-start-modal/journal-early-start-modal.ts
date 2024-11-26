import { Component, Input } from '@angular/core';
import { SlotDetail } from '@dvsa/mes-journal-schema';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { EarlyStartDidContinue, EarlyStartDidReturn } from '@store/journal/journal.actions';

import { DateTime } from '@shared/helpers/date-time';
import { ModalEvent } from './journal-early-start-modal.constants';

@Component({
  selector: 'journal-early-start-modal',
  templateUrl: './journal-early-start-modal.html',
  styleUrls: ['./journal-early-start-modal.scss'],
})
export class JournalEarlyStartModal {
  @Input()
  private slotData: SlotDetail;

  constructor(
    public store$: Store<StoreModel>,
    public modalController: ModalController
  ) {}

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
    return new DateTime(this.slotData.start).format('kk:mm');
  }
}
