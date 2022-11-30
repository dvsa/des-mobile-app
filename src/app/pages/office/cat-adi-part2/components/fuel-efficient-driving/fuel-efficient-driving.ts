import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'fuel-efficient-driving',
  templateUrl: 'fuel-efficient-driving.html',
})
export class FuelEfficientDriving implements OnChanges {
  @Input()
  fuelEfficientDriving: boolean;

  @Input()
  disabled: boolean;

  @Input()
  formGroup: FormGroup;

  @Output()
  fedChange = new EventEmitter<boolean>();

  private formControl: FormControl = null;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl('fuelEfficientDriving', this.formControl);
      if (this.disabled) {
        this.formControl.patchValue(false);
        return;
      }
    }

    this.formControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });

    if (this.fuelEfficientDriving !== undefined) {
      this.formControl.patchValue(this.fuelEfficientDriving);
    }
  }

  fedChanged(fuelEfficientDriving: string): void {
    if (this.formControl.valid) {
      this.fedChange.emit(fuelEfficientDriving === 'fuel-efficient-driving-yes');
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
