import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { ModalEvent } from '../../test-report.constants';
import { legalRequirementsLabels } from '../../../../shared/constants/legal-requirements/legal-requirements.constants';

@IonicPage()
@Component({
  selector: 'legal-requirements-modal',
  templateUrl: 'legal-requirements-modal.html',
})
export class LegalRequirementsModal {

  legalRequirements: legalRequirementsLabels[];
  isDelegated: boolean;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
  ) {
    this.legalRequirements = this.navParams.get('legalRequirements');
    this.isDelegated = this.navParams.get('isDelegated') === null ? false : this.navParams.get('isDelegated');
  }

  onContinue() {
    this.viewCtrl.dismiss(ModalEvent.CONTINUE);
  }

  onCancel() {
    this.viewCtrl.dismiss(ModalEvent.CANCEL);
  }

  onTerminate() {
    this.viewCtrl.dismiss(ModalEvent.TERMINATE);
  }

}
