import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import {MotHistory, MotStatusCodes} from '@dvsa/mes-mot-schema';

@Component({
  selector: 'mot-card',
  templateUrl: './mot-card.component.html',
  styleUrls: ['./mot-card.component.scss'],
})
export class MotCardComponent {
  @Input()
  status = '';
  @Input()
  formGroup: UntypedFormGroup;
  @Input()
  data: MotHistory = {
    registration: '',
    make: '',
    model: '',
    status: MotStatusCodes.NO_DETAILS,
    expiryDate: '',
  };
  alternateEvidenceRadioCheck: boolean;
  @Output()
  alternateEvidenceChange = new EventEmitter<boolean>();

  constructor(public networkState: NetworkStateProvider) {}

  callWasSuccessful() {
    return (
      (+this.status === HttpStatusCodes.OK || this.status === 'Already Saved') &&
      this?.data?.status !== MotStatusCodes.NO_DETAILS &&
      this?.data?.status !== MotStatusCodes.AGE_EXEMPTION
    );
  }

  noDetails(): boolean {
    return +this.status === HttpStatusCodes.NO_CONTENT || this.data?.status === MotStatusCodes.NO_DETAILS;
  }

  is404(): boolean {
    return +this.status === HttpStatusCodes.NOT_FOUND;
  }

  isValidMOT() {
    return this.data.status === MotStatusCodes.VALID;
  }

  evidenceRadioSelected(event: boolean) {
    this.alternateEvidenceRadioCheck = event;
    this.alternateEvidenceChange.emit(event);
  }

  searchFailed() {
    return +this.status === HttpStatusCodes.UNDEFINED;
  }
}