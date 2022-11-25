import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { isEmpty } from 'lodash';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { VehicleDetailsApiService } from '@providers/vehicle-details-api/vehicle-details-api.service';

@Component({
  selector: 'vehicle-registration',
  templateUrl: './vehicle-registration.html',
  styleUrls: ['./vehicle-registration.scss'],
})
export class VehicleRegistrationComponent implements OnChanges {

  @Input()
  vehicleRegistration: string;
  motStatus: string = null;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  vehicleRegistrationChange = new EventEmitter<string>();

  formControl: UntypedFormControl;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    private vehicleProvider: VehicleDetailsApiService,
  ) {
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl('vehicleRegistration', this.formControl);
    }
    this.formControl.patchValue(this.vehicleRegistration);
  }

  getMOTandTax(identifier: string) {
    this.vehicleProvider.getVehicleByIdentifier(identifier)
      .subscribe((response: any) => {
        return this.motStatus = response?.vehicle?.motStatus;
      });
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

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
