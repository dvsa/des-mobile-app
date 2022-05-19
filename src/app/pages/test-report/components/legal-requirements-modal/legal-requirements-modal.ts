import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { legalRequirementsLabels } from '@shared/constants/legal-requirements/legal-requirements.constants';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ReturnToTest } from '@pages/test-report/test-report.actions';
import { ModalEvent } from '../../test-report.constants';

@Component({
  selector: 'legal-requirements-modal',
  templateUrl: 'legal-requirements-modal.html',
  styleUrls: ['legal-requirements-modal.scss'],
})
export class LegalRequirementsModal {

  legalRequirements: legalRequirementsLabels[];
  isDelegated: boolean;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private store$: Store<StoreModel>,
  ) {
    this.legalRequirements = this.navParams.get('legalRequirements');
    this.isDelegated = this.navParams.get('isDelegated') === null ? false : this.navParams.get('isDelegated');
  }

  async onContinue() {
    await this.modalCtrl.dismiss(ModalEvent.CONTINUE);
  }

  async onCancel() {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
    this.store$.dispatch(ReturnToTest());
  }

  async onTerminate() {
    await this.modalCtrl.dismiss(ModalEvent.TERMINATE);
  }

}
