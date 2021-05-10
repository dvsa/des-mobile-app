import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isEmpty } from 'lodash';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';

@Component({
  selector: 'vehicle-registration',
  templateUrl: './vehicle-registration.html',
  styleUrls: ['./vehicle-registration.scss'],
})
export class VehicleRegistrationComponent implements OnChanges {

  @Input()
  vehicleRegistration: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  vehicleRegistrationChange = new EventEmitter<string>();

  formControl: FormControl;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl('vehicleRegistration', this.formControl);
    }
    this.formControl.patchValue(this.vehicleRegistration);
  }

  vehicleRegistrationChanged(event: any): void {
    if (!this.registrationNumberValidator.pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(nonAlphaNumericValues, '');

      if (isEmpty(event.target.value)) {
        this.formControl.setErrors({ invalidValue: event.target.value });
      }
    }
    this.vehicleRegistrationChange.emit(event.target.value.toUpperCase());
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
