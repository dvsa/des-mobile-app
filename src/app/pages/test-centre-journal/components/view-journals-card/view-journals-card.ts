import { Component, Input } from '@angular/core';
import { TestCentreDetailResponse } from '../../../../shared/models/test-centre-journal.model';

@Component({
  selector: 'view-journals-card',
  templateUrl: 'view-journals-card.html',
  styleUrls: ['./view-journals-card.scss'],
})
export class ViewJournalsCardComponent {

  @Input() testCentreResults: TestCentreDetailResponse;

  get interfaceOptions() {
    return {
      cssClass: 'mes-select',
      enableBackdropDismiss: false,
      placeholder: 'Select examiner',
      okText: 'Submit',
      cancelText: 'Cancel',
    };
  }

}
