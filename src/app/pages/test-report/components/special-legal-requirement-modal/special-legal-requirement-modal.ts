import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { ModalEvent } from '../../test-report.constants';

@IonicPage()
@Component({
  selector: 'special-legal-requirement-modal',
  templateUrl: 'special-legal-requirement-modal.html',
})
export class SpecialLegalRequirementModal {

  constructor(
    private viewCtrl: ViewController,
  ) { }

  onCancel() {
    this.viewCtrl.dismiss(ModalEvent.CANCEL);
  }

  onTerminate() {
    this.viewCtrl.dismiss(ModalEvent.TERMINATE);
  }
  onProceed() {
    this.viewCtrl.dismiss(ModalEvent.CONTINUE);
  }

}
