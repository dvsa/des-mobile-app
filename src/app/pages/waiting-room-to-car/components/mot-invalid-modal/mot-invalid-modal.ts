import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { ModalController } from '@ionic/angular';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import {
  MotInvalidModalOpened,
  MotVRNAmendedPopup,
  MotVRNConfirmed,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';

@Component({
  selector: 'mot-invalid-modal',
  templateUrl: 'mot-invalid-modal.html',
  styleUrls: ['mot-invalid-modal.scss'],
})
export class MotInvalidModal implements OnInit {
  private static maxCallStackHandler = {
    emitEvent: false,
    onlySelf: true,
  };
  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();
  formGroup: UntypedFormGroup;
  formControl: UntypedFormControl;

  @Input()
  textZoom: string;

  @Input()
  currentVrn: string;

  constructor(
    private modalController: ModalController,
    private store$: Store<StoreModel>,
  ) {
  }

  ngOnInit() {
    this.store$.dispatch(MotInvalidModalOpened());
    this.formGroup = new UntypedFormGroup({});
    this.formControl = new UntypedFormControl(null, [
      Validators.required,
      Validators.pattern(this.registrationNumberValidator.rawPatternNoFlags),
      Validators.maxLength(Number(getRegistrationNumberValidator().maxLength)),
    ]);
    this.formGroup.addControl('vehicleRegistrationConfirmVrn', this.formControl);
  }

  get invalid() {
    return !this.formControl?.valid;
  }

  onChange(value: string) {
    if (typeof value === 'string') {
      const sanitisedValue = value.toUpperCase()
        .replace(nonAlphaNumericValues, '');
      this.formControl.patchValue(sanitisedValue);
    }
    this.formControl.updateValueAndValidity(MotInvalidModal.maxCallStackHandler);
  }

  async clickConfirm() {
    if (this.formControl.valid) {
      // check if VRN is in state is same as the value you have typed in the input
      if (this.currentVrn?.toUpperCase() !== this.formControl.value?.toUpperCase()) {
        this.store$.dispatch(MotVRNAmendedPopup());
      }
      // add analytic for closing down the input
      this.store$.dispatch(MotVRNConfirmed());

      await this.modalController.dismiss(this.formControl.value);
    }
  }
}
