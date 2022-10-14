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
  formGroup: FormGroup;

  @Input()
  fuelEfficientDriving: boolean;

  @Output()
  fedChange = new EventEmitter<boolean>();

  private formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, Validators.required);
      this.formGroup.addControl('fuelEfficientDriving', this.formControl);
    }

    if (this.fuelEfficientDriving === true || this.fuelEfficientDriving === false) {
      this.formControl.patchValue(String(this.fuelEfficientDriving));
    }
  }

  fedChanged(fuelEfficientDriving: string): void {
    this.fedChange.emit(fuelEfficientDriving === 'fuel-efficient-driving-yes');
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
