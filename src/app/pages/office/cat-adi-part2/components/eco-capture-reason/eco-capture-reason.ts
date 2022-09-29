import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'eco-capture-reason',
  templateUrl: 'eco-capture-reason.html',
})

export class EcoCaptureReasonComponent implements OnChanges {
  @Input()
  formGroup: FormGroup;

  private formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, Validators.required);
      this.formGroup.addControl('ecoCaptureReason', this.formControl);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
