import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MotHistory } from '@dvsa/mes-mot-schema';
import { IonCol, IonIcon, IonRow, IonText } from '@ionic/angular';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { getMakeAndModel, hasMakeOrModel } from '@shared/helpers/mot-formatter';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { AlternateMotEvidenceComponent } from '../alternate-mot-evidence/alternate-mot-evidence.component';

@Component({
  selector: 'mot-card',
  templateUrl: './mot-card.component.html',
  styleUrls: ['./mot-card.component.scss'],
  imports: [IonRow, IonCol, IonIcon, IonText, AlternateMotEvidenceComponent, FormsModule, ReactiveFormsModule],
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
    status: 'No details',
    expiryDate: '',
  };
  alternateEvidenceRadioCheck: boolean;
  @Output()
  alternateEvidenceChange = new EventEmitter<boolean>();

  constructor(public networkState: NetworkStateProvider) {}

  isCallSuccessful(): boolean {
    return (
      (+this.status === HttpStatusCodes.OK || this.status === 'Already Saved') &&
      this?.data?.status !== 'No details' &&
      this?.data?.status !== 'Age exemption'
    );
  }

  isNoDetails(): boolean {
    return (
      !this.isSearchFailed() &&
      (+this.status === HttpStatusCodes.NO_CONTENT ||
        this.data?.status === 'No details' ||
        this?.data?.status === 'Age exemption' ||
        this.is404())
    );
  }

  is404(): boolean {
    return +this.status === HttpStatusCodes.NOT_FOUND;
  }

  isValidMOT(): boolean {
    return this.data.status === 'Valid';
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

  protected readonly getMakeAndModel = getMakeAndModel;
  protected readonly hasMakeOrModel = hasMakeOrModel;
}
