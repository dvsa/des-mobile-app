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

  showSearchSpinner: boolean = false;
  vehicleRegistrationReset: boolean = false;
  motStatus: string;
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
    console.log('here');
  }

  getMOTandTax(identifier: string) {
    console.log('CALL END POINT:', identifier);
    this.showSearchSpinner = true;
    this.vehicleRegistrationReset = false;
    this.vehicleProvider.getVehicleByIdentifier(identifier)
      .subscribe((response: any) => {
        this.showSearchSpinner = false;
        console.log('response', response);
        return this.motStatus = response?.vehicle?.motStatus ? response?.vehicle?.motStatus : 'No details found';
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
    this.vehicleRegistrationReset = true;
    this.vehicleRegistrationChange.emit(event.target.value?.toUpperCase());
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
