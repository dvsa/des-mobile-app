import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';

@Component({
  selector: 'vrn-capture-modal',
  templateUrl: './vrn-capture-modal.html',
  styleUrls: ['./vrn-capture-modal.scss'],
})
export class VRNCaptureModal {

  onCancel: Function;

  onSave: Function;

  vehicleRegistration: string;

  isValid: boolean = true;

  formGroup: FormGroup;

  vehicleRegistrationFormControlName: string = 'vehicleRegistration';

  formInvalid: boolean = false;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    private navParams: NavParams,
  ) {
    this.onCancel = this.navParams.get('onCancel');
    this.onSave = this.navParams.get('onSave');
    this.formGroup = new FormGroup({});
    this.formGroup.addControl(
      this.vehicleRegistrationFormControlName, new FormControl(
        null, [
          Validators.required,
          Validators.pattern(/[A-Z0-9]{1,7}$/gi),
          Validators.maxLength(parseInt(getRegistrationNumberValidator().maxLength, 10)),
        ],
      ),
    );
    this.vehicleRegistrationFormControl.valueChanges.subscribe(value => {
      this.updateVehicleRegistrationNumber(value);
    });
  }

  inputChange(value) {
    this.updateVehicleRegistrationNumber(value);
  }

  updateVehicleRegistrationNumber(value) {
    const newValue = value.replace(nonAlphaNumericValues, '')
      .toUpperCase();
      // .substr(0, 7);
    if (this.registrationNumberValidator.pattern.test(newValue)) {
      this.vehicleRegistrationFormControl.patchValue(newValue);
      this.vehicleRegistrationFormControl.updateValueAndValidity();
    }
    this.formInvalid = this.vehicleRegistrationFormControl.dirty && this.vehicleRegistrationFormControl.invalid;
    this.getFormValidationErrors();
  }

  async validateThenSave() {
    if (this.registrationNumberValidator.pattern.test(this.vehicleRegistration)) {
      await this.onSave(this.vehicleRegistration);
    }
  }

  get invalid(): boolean {
    // return true;
    this.getFormValidationErrors();
    return this.vehicleRegistrationFormControl.dirty && !this.vehicleRegistrationFormControl.valid;
  }

  get vehicleRegistrationFormControl(): AbstractControl {
    return this.formGroup.get('vehicleRegistration');
  }

  getFormValidationErrors() {
    Object.keys(this.formGroup.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.formGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

}
