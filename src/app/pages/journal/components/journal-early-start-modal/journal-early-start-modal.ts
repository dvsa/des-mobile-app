import { ModalController, NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { SlotDetail } from '@dvsa/mes-journal-schema';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { EarlyStartDidContinue, EarlyStartDidReturn } from '@store/journal/journal.actions';
import * as moment from 'moment';

import { ModalEvent } from './journal-early-start-modal.constants';

@Component({
  selector: 'journal-early-start-modal',
  templateUrl: './journal-early-start-modal.html',
  styleUrls: ['./journal-early-start-modal.scss'],
})
export class JournalEarlyStartModal implements OnInit {
  private slotData: SlotDetail;

  constructor(
    public store$: Store<StoreModel>,
    public modalController: ModalController,
    private params: NavParams,
  ) {
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
