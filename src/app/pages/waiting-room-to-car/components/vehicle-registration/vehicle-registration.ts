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

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  vehicleRegistrationChange = new EventEmitter<string>();

  @Output()
  motStatusChange = new EventEmitter<string>();

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
      if (this.vehicleRegistration != null) this.getMotAndTax(this.vehicleRegistration);
    }
    this.formControl.patchValue(this.vehicleRegistration);
  }

  /**
   * Call service to get vehicle payload, only if an identifier has been supplied
   * @param identifier
   */
  getMotAndTax(identifier: string): void {
    if (identifier) {
      this.vehicleProvider.getVehicleByIdentifier(identifier)
        .subscribe((response: any) => {
          this.motStatusChange.emit(response?.vehicle?.motStatus);
        });
    }
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
