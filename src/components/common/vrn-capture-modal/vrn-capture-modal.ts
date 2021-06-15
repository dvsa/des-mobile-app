import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { isEmpty } from 'lodash';

@Component({
  selector: 'vrn-capture-modal',
  templateUrl: './vrn-capture-modal.html',
  styleUrls: ['./vrn-capture-modal.scss'],
})
export class VRNCaptureModal {

  onCancel: Function;

  onSave: Function;

  vehicleRegistration: string;

  isValid: boolean;

  formGroup: FormGroup;

  formControl: FormControl;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    private navParams: NavParams,
  ) {
    this.onCancel = this.navParams.get('onCancel');
    this.onSave = this.navParams.get('onSave');
    this.formGroup = new FormGroup({});
    this.formControl = new FormControl(null, [Validators.required]);
    this.formGroup.addControl('vehicleRegistration', this.formControl);
  }

  vehicleRegistrationNumberChanged(vehicleRegistration: string): void {
    if (!this.registrationNumberValidator.pattern.test(vehicleRegistration)) {
      const value = vehicleRegistration.replace(nonAlphaNumericValues, '');

      if (isEmpty(value)) {
        this.formControl.setErrors({ value });
      }
    }
    this.formControl.patchValue(this.vehicleRegistration);
  }

  async validateThenSave() {
    if (this.registrationNumberValidator.pattern.test(this.vehicleRegistration)) {
      await this.onSave(this.vehicleRegistration);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
