import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'eco-capture-reason',
  templateUrl: 'eco-capture-reason.html',
})

export class EcoCaptureReasonComponent implements OnChanges {
  @Input()
  formGroup: FormGroup;

  @Input()
  ecoCaptureReason: string;

  @Input()
  fuelEfficientDriving: boolean = false;

  @Output()
  ecoCaptureReasonChange = new EventEmitter<string>();

  private formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl('ecoCaptureReason', this.formControl);
    }

    this.formControl.setValidators(this.fuelEfficientDriving
      ? Validators.compose([Validators.required, Validators.maxLength(1000)]) : null);
    this.formControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });

    this.formControl.patchValue(this.ecoCaptureReason, { onlySelf: true, emitEvent: false });
  }

  ecoCaptureReasonChanged(ecoCaptureReason: string): void {
    if (this.formControl.valid) {
      this.ecoCaptureReasonChange.emit(ecoCaptureReason);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
