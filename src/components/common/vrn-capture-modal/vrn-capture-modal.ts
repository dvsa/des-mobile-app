import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { FieldValidators, getRegistrationNumberValidator } from '@shared/constants/field-validators/field-validators';

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
  }

  vrnChanged(value: string) {
    this.vehicleRegistration = value;
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl('vehicleRegistration', this.formControl);
    }
    this.formControl.patchValue(this.vehicleRegistration);
  }

  async validateThenSave() {
    if (!this.registrationNumberValidator.pattern.test(this.vehicleRegistration)) {
      this.isValid = false;
      return;
    }
    await this.onSave(this.vehicleRegistration);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
