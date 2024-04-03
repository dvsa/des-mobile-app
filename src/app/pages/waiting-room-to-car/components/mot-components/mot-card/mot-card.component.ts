import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { VehicleDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { UntypedFormGroup } from '@angular/forms';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { MotStatusCodes } from '@shared/models/mot-status-codes';

@Component({
  selector: 'mot-card',
  templateUrl: './mot-card.component.html',
  styleUrls: ['./mot-card.component.scss'],
})
export class MotCardComponent {

  @Input()
  status: string = '';
  @Input()
  didNotMatch: boolean = false;
  @Input()
  formGroup: UntypedFormGroup;
  @Input()
  data: VehicleDetails = {
    registration: '',
    make: '',
    model: '',
    colour: '',
    status: '',
    testExpiryDate: '',
    testDueDate: '',
    testDate: '',
  };
  alternateEvidenceRadioCheck: boolean;
  @Output()
  alternateEvidenceChange = new EventEmitter<boolean>();
  @Output()
  alternativeEvidenceDescriptionUpdate = new EventEmitter<string>();

  //This is here to help with visits and tests in places with poor connectivity,
  // this will be deleted in the full release
  @Input()
  fakeOffline: boolean = false;

  constructor(
    public networkState: NetworkStateProvider,
  ) {
  }

  callWasSuccessful() {
    return (+this.status === HttpStatusCodes.OK || this.status === 'Already Saved')
      && this?.data?.status !== MotStatusCodes.NO_DETAILS
      && this.didNotMatch === false
  }

  noDetails(): boolean {
    return (+this.status === HttpStatusCodes.NO_CONTENT
      || this.data?.status === MotStatusCodes.NO_DETAILS);
  }

  is404(): boolean {
    return (+this.status === HttpStatusCodes.NOT_FOUND);
  }

  isOffline(): boolean {
    return (this.networkState.getNetworkState() !== ConnectionStatus.ONLINE || this.fakeOffline);
  }
  isValidMOT() {
    return this.data.status === MotStatusCodes.VALID;
  }

  evidenceRadioSelected(event: boolean) {
    this.alternateEvidenceRadioCheck = event;
    this.alternateEvidenceChange.emit(event);
  }

  descriptionUpdated(event: string) {
    this.alternativeEvidenceDescriptionUpdate.emit(event);
  }
}