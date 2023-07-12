import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { ModalController } from '@ionic/angular';

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

  constructor(
    private modalController: ModalController,
  ) {
  }

  ngOnInit() {
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
      await this.modalController.dismiss(this.formControl.value);
    }
  }
}
