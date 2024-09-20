import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MotHistory, MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { HttpStatusCodes } from '@shared/models/http-status-codes';

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

  isCallSuccessful(): boolean {
    return (
      (+this.status === HttpStatusCodes.OK || this.status === 'Already Saved') &&
      this?.data?.status !== MotStatusCodes.NO_DETAILS &&
      this?.data?.status !== MotStatusCodes.AGE_EXEMPTION
    );
  }

  isNoDetails(): boolean {
    return (
      !this.isSearchFailed() &&
      (+this.status === HttpStatusCodes.NO_CONTENT ||
        this.data?.status === MotStatusCodes.NO_DETAILS ||
        this?.data?.status === MotStatusCodes.AGE_EXEMPTION ||
        this.is404())
    );
  }

  is404(): boolean {
    return +this.status === HttpStatusCodes.NOT_FOUND;
  }

  isValidMOT(): boolean {
    return this.data.status === MotStatusCodes.VALID;
  }

  evidenceRadioSelected(event: boolean) {
    this.alternateEvidenceRadioCheck = event;
    this.alternateEvidenceChange.emit(event);
  }

  isSearchFailed(): boolean {
    return (
      +this.status === HttpStatusCodes.UNDEFINED ||
      +this.status === HttpStatusCodes.INTERNAL_SERVER_ERROR ||
      +this.status === HttpStatusCodes.BAD_GATEWAY ||
      +this.status === HttpStatusCodes.SERVICE_UNAVAILABLE ||
      +this.status === HttpStatusCodes.GATEWAY_TIMEOUT
    );
  }
}
