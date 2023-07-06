import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { VehicleDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {
  MOTOffline,
  MOTServiceUnavailable,
  NoMOTDetails,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';

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
  @Output()
  alternateEvidenceChange = new EventEmitter<boolean>();
  @Output()
  alternativeEvidenceDescriptionUpdate = new EventEmitter<string>();

  constructor(
    private networkState: NetworkStateProvider,
    private store$: Store<StoreModel>,
  ) {
  }

  callWasSuccessful() {
    return (this.status === '200' || this.status === 'Already Saved')
      && this?.data?.status !== 'No details'
      && this.networkState.getNetworkState() === ConnectionStatus.ONLINE;
  }

  NoDetails(): boolean {
    const value = (this.status === '204' || this.data?.status === 'No details');
    if (value) {
      this.store$.dispatch(NoMOTDetails());
    }
    return value;
  }

  is404(): boolean {
    const value = (this.status === '404');
    if (value) {
      this.store$.dispatch(MOTServiceUnavailable());
    }
    return value;
  }

  isOffline(): boolean {
    const value = (this.networkState.getNetworkState() !== ConnectionStatus.ONLINE);
    if (value) {
      this.store$.dispatch(MOTOffline());
    }
    return value;
  }
  isValidMOT() {
    return this.data.status === 'Valid';
  }

  evidenceRadioSelected(event: boolean) {
    this.alternateEvidenceRadioCheck = event;
    this.alternateEvidenceChange.emit(event);
  }

  descriptionUpdated(event: string) {
    this.alternativeEvidenceDescriptionUpdate.emit(event);
  }
}
