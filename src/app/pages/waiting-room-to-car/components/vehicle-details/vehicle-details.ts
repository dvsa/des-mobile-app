import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';

@Component({
  selector: 'vehicle-details',
  templateUrl: './vehicle-details.html',
  imports: [FormsModule, ReactiveFormsModule, FormatIdPipe],
})
export class VehicleDetailsComponent implements OnChanges {
  @Input()
  vehicleDetails: boolean;

  @Input()
  vehicleDetailsType: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  vehicleDetailsChange = new EventEmitter();

  formControl: UntypedFormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
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
