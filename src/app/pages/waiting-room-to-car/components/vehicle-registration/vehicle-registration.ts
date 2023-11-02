import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { isEmpty } from 'lodash';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';

@Component({
  selector: 'vehicle-registration',
  templateUrl: './vehicle-registration.html',
})
export class VehicleRegistrationComponent implements OnChanges {

  @Input()
  vehicleRegistration: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  vehicleRegistrationChange = new EventEmitter<string>();

  @Output()
  vehicleRegistrationBlur = new EventEmitter<string>();

  formControl: UntypedFormControl;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl('vehicleRegistration', this.formControl);

      // if vehicleRegistration already set using VRN early modal and not interacted with here,
      // we trick the component into dispatching the emission
      if (this.vehicleRegistration != null) {
        this.onBlurEvent(this.vehicleRegistration);
      }
    }
    this.formControl.patchValue(this.vehicleRegistration);
  }

  vehicleRegistrationChanged(event: any): void {
    if (
      typeof event.target.value === 'string'
      && !this.registrationNumberValidator.pattern.test(event.target.value)
    ) {
      event.target.value = event.target.value?.replace(nonAlphaNumericValues, '');

      if (isEmpty(event.target.value)) {
        this.formControl.setErrors({ invalidValue: event.target.value });
      }
    }
    this.vehicleRegistrationChange.emit(event.target.value?.toUpperCase());
  }

  onBlurEvent = (vehicleRegistration: string): void => {
    this.vehicleRegistrationBlur.emit(vehicleRegistration);
  };

  protected readonly Number = Number;
}
