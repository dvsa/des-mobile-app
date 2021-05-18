import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { ModalEvent } from '../../test-report.constants';

@IonicPage()
@Component({
  selector: 'eta-invalid-modal',
  templateUrl: 'eta-invalid-modal.html',
})
export class EtaInvalidModal {
  constructor(private viewCtrl: ViewController) {}

  onCancel() {
    this.viewCtrl.dismiss(ModalEvent.CANCEL);
  }
}
