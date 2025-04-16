import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ModalEvent } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal.constants';
import * as futureTestModalActions from '@pages/journal/journal.actions';

@Component({
    selector: 'journal-rekey-modal',
    templateUrl: './journal-future-test-modal.html',
    styleUrls: ['./journal-future-test-modal.scss'],
    standalone: false
})
export class JournalFutureTestModal {
  constructor(
    private modalController: ModalController,
    private store$: Store
  ) {}

  onCancel = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.CANCEL);
    this.store$.dispatch(futureTestModalActions.FutureTestModalCancelButton());
  };

  onStartTest = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.START);
    this.store$.dispatch(futureTestModalActions.FutureTestModalContinueButton());
  };
}
