import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'vehicle-details',
  templateUrl: './vehicle-details.html',
})
export class VehicleDetailsComponent implements OnChanges {

  @Input()
  vehicleDetails: boolean;

  @Input()
  vehicleDetailsType: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  vehicleDetailsChange = new EventEmitter();

  formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl(this.formControlName, this.formControl);
    }
    this.formControl.patchValue(this.vehicleDetails);
  }

  vehicleDetailsChanged(): void {
    if (this.formControl.valid) {
      this.vehicleDetailsChange.emit();
    }
  }

  get formControlName() {
    const vehicleDetails = this.vehicleDetailsType.replace(' ', '-').toLowerCase();
    return `vehicle-details-${vehicleDetails}`;
  }
}
