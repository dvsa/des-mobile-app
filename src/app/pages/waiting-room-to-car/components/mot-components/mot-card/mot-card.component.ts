import { Component, Input } from '@angular/core';
import { VehicleDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'mot-card',
  templateUrl: './mot-card.component.html',
  styleUrls: ['./mot-card.component.scss'],
})
export class MotCardComponent {

  @Input()
  status: string = '';
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
  description: string;

  constructor(
    private networkState: NetworkStateProvider,
  ) {
  }

  callWasSuccessful() {
    return (this.status === '200' || this.status === 'Already Saved') && this?.data?.status !== 'No details';
  }

  protected readonly ConnectionStatus = ConnectionStatus;

  isValidMOT() {
    return this.data.status === 'Valid';
  }

  evidenceRadioSelected(event: boolean) {
    console.log(event);
    this.alternateEvidenceRadioCheck = event;
  }

  descriptionUpdated(event: string) {
    console.log(event);
    this.description = event;
  }
}
