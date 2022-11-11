import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Configuration } from '@dvsa/mes-test-schema/categories/CPC';

@Component({
  selector: 'vehicle-details-cat-cpc',
  templateUrl: 'vehicle-details.html',
})
export class VehicleDetailsCatCPCComponent {

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  configuration: Configuration;

  @Output()
  vehicleDetailsChange = new EventEmitter();

  formControl: UntypedFormControl;

  static readonly fieldName: string = 'configuration';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl(VehicleDetailsCatCPCComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.configuration);
  }

  vehicleDetailsChanged(configuration: string): void {
    this.vehicleDetailsChange.emit(configuration);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
