import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'eta-physical-type',
  templateUrl: './eta-physical-type.html',
  standalone: false,
})
export class ETAPhysicalTypeComponent implements OnChanges {
  @Input()
  toggled: boolean;

  @Input()
  physicalType: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  checkboxToggleChanged = new EventEmitter();

  formControl: UntypedFormControl;
  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl(this.formControlName, this.formControl);
    }
    this.formControl.patchValue(this.toggled);
  }

  checkboxToggle(): void {
    if (this.formControl.valid) {
      this.checkboxToggleChanged.emit();
    }
  }

  get formControlName() {
    return `physical-intervention-type-${this.physicalType}`;
  }
}
