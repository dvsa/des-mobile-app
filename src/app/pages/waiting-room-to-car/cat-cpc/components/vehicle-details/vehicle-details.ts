import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Configuration } from '@dvsa/mes-test-schema/categories/CPC';

@Component({
  selector: 'vehicle-details-cat-cpc',
  templateUrl: 'vehicle-details.html',
})
export class VehicleDetailsCatCPCComponent {

  @Input()
  formGroup: FormGroup;

  @Input()
  configuration: Configuration;

  @Output()
  vehicleDetailsChange = new EventEmitter();

  private formControl: FormControl;

  static readonly fieldName: string = 'configuration';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
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
