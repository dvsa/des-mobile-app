import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
      this.formControl = new FormControl(null);
      this.formGroup.addControl('ecoCaptureReason', this.formControl);
    }
  }
}
