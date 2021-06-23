import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

enum EyesightTestResult {
  Pass = 'P',
  Fail = 'F',
}

@Component({
  selector: 'eyesight-test',
  templateUrl: 'eyesight-test.html',
})
export class EyesightTestComponent implements OnChanges {

  formControl: FormControl;

  @Input()
  eyesightPassRadioChecked: boolean;

  @Input()
  eyesightFailRadioChecked: boolean;

  @Input()
  formGroup: FormGroup;

  @Output()
  eyesightTestResultChange = new EventEmitter<boolean>();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.formGroup.addControl('eyesightCtrl', this.formControl);
    }
    if (this.eyesightPassRadioChecked || this.eyesightFailRadioChecked) {
      this.formControl.patchValue(this.eyesightPassRadioChecked ? EyesightTestResult.Pass : EyesightTestResult.Fail);
    }
  }

  eyesightTestResultChanged(result: string): void {
    if (this.formControl.valid) {
      this.eyesightTestResultChange.emit(result === EyesightTestResult.Pass);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  get testPassed(): boolean {
    return this.eyesightPassRadioChecked;
  }

  get testFailed(): boolean {
    return this.eyesightFailRadioChecked;
  }
}
