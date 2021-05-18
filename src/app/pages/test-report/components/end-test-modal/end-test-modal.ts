import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { ModalEvent } from '../../test-report.constants';

@IonicPage()
@Component({
  selector: 'end-test-modal',
  templateUrl: 'end-test-modal.html',
})
export class EndTestModal {

  constructor(
    private viewCtrl: ViewController,
  ) {}

  onCancel() {
    this.viewCtrl.dismiss(ModalEvent.CANCEL);
  }

  onContinue() {
    this.viewCtrl.dismiss(ModalEvent.CONTINUE);
  }

  onTerminate() {
    this.viewCtrl.dismiss(ModalEvent.TERMINATE);
  }

}
