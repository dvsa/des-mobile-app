import { Component, Input } from '@angular/core';

@Component({
  selector: 'licence-data-error',
  templateUrl: 'licence-data-error.html',
  styleUrls: ['licence-data-error.scss'],
})
export class LicenceDataError {

  @Input()
  candidateDataError: boolean = false;

  @Input()
  candidateDataUnavailable: boolean = false;

  @Input()
  isOfflineError: boolean = false;

  get errorHeading(): string {
    if (this.candidateDataUnavailable) {
      return 'Error obtaining details';
    }
    if (this.candidateDataError) {
      return 'No data found';
    }
    if (this.isOfflineError) {
      return 'No connectivity';
    }
    return 'Unknown error';
  }

  get errorBody(): string {
    if (this.candidateDataUnavailable) {
      return 'We are unable to return DVLA data for given candidate.';
    }
    if (this.candidateDataError) {
      return 'No DVLA data has been found using candidates driving licence number.';
    }
    if (this.isOfflineError) {
      return 'DVLA licence information currently unavailable.';
    }
    return 'We have received an unknown error for this candidate.';
  }
}
