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

  @Output()
  fedChange = new EventEmitter<boolean>();

  private formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, Validators.required);
      this.formGroup.addControl('fuelEfficientDriving', this.formControl);
    }
  }

  fedChanged(fuelEfficientDriving: boolean): void {
    this.fedChange.emit(fuelEfficientDriving);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
