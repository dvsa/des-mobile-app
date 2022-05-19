import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ReturnToTest } from '@pages/test-report/test-report.actions';
import { ModalEvent } from '../../test-report.constants';

@Component({
  selector: 'special-legal-requirement-modal',
  templateUrl: 'special-legal-requirement-modal.html',
  styleUrls: ['special-legal-requirement-modal.scss'],
})
export class SpecialLegalRequirementModal {

  constructor(
    private modalCtrl: ModalController,
    private store$: Store<StoreModel>,
  ) { }

  async onCancel() {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
    this.store$.dispatch(ReturnToTest());
  }

  async onTerminate() {
    await this.modalCtrl.dismiss(ModalEvent.TERMINATE);
  }
  async onProceed() {
    await this.modalCtrl.dismiss(ModalEvent.CONTINUE);
  }

}
