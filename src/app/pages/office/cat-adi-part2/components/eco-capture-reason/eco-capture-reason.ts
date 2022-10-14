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

  @Output()
  ecoCaptureReasonChange = new EventEmitter<string>();

  private formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, Validators.required);
      this.formGroup.addControl('ecoCaptureReason', this.formControl);
    }
    this.formControl.patchValue(this.ecoCaptureReason);
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
