import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'test-finalisation-invalid-test-data-modal',
  templateUrl: 'test-finalisation-invalid-test-data-modal.html',
})
export class TestFinalisationInvalidTestDataModal {

  onCancel: Function;
  onReturnToTestReport: Function;

  constructor(
    private navParams: NavParams,
  ) {
    this.onCancel = this.navParams.get('onCancel');
    this.onReturnToTestReport = this.navParams.get('onReturnToTestReport');
  }

}
