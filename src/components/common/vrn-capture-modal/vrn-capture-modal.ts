import { Component } from '@angular/core';
import {
  AbstractControl, FormControl, FormGroup, Validators,
} from '@angular/forms';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'vrn-capture-modal',
  templateUrl: './vrn-capture-modal.html',
  styleUrls: ['./vrn-capture-modal.scss'],
})
export class VRNCaptureModal {

  vehicleRegistrationNumber: string;

  formGroup: FormGroup;

  vehicleRegistrationFormControlName: string = 'vehicleRegistration';

  formInvalid: boolean = false;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    public modalController: ModalController,
  ) {
    this.formGroup = new FormGroup({});
    this.formGroup.addControl(
      this.vehicleRegistrationFormControlName, new FormControl(
        null, [
          Validators.required,
          Validators.pattern('^[A-Z0-9]{1,7}$'),
          Validators.maxLength(parseInt(getRegistrationNumberValidator().maxLength, 10)),
        ],
      ),
    );
  }

  inputChange(input: any) {
    if (typeof input === 'string') {
      input = input.toUpperCase()
        .replace(nonAlphaNumericValues, '');
      this.vehicleRegistrationNumber = input;
      this.vehicleRegistrationFormControl.patchValue(input, {
        emitEvent: false,
        emitViewToModelChange: false,
      });
    }
    this.formInvalid = this.vehicleRegistrationFormControl.dirty && this.vehicleRegistrationFormControl.invalid;
  }

  async validateThenDismiss() {
    if (this.registrationNumberValidator.pattern.test(this.vehicleRegistrationNumber)) {
      this.modalController.dismiss({ vehicleRegNumber: this.vehicleRegistrationNumber });
    }
  }

  get vehicleRegistrationFormControl(): AbstractControl {
    return this.formGroup.get('vehicleRegistration');
  }

}
