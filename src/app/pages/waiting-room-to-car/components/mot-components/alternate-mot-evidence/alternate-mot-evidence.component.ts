import {
  Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

enum AlternateEvidenceTestResult {
  Pass = 'P',
  Fail = 'F',
}
@Component({
  selector: 'alternate-mot-evidence',
  templateUrl: './alternate-mot-evidence.component.html',
  styleUrls: ['./alternate-mot-evidence.component.scss'],
})
export class AlternateMotEvidenceComponent implements OnInit {

  formControl: UntypedFormControl = null;

  @Input()
  alternateEvidencePassRadioChecked: boolean;

  @Input()
  alternateEvidenceFailRadioChecked: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  alternateEvidenceTestResultChange = new EventEmitter<boolean>();
  @Output()
  alternativeEvidenceUpdate = new EventEmitter<string>();

  ngOnInit() {
    console.log(this.formGroup);
    console.log(this.formControl);
    this.setupControl();
  }

  setupControl(): void {
    if (!this.formControl) {
      this.formControl = null;
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.formGroup.addControl('alternateEvidenceCtrl', this.formControl);
      console.log(this.formControl);
    }
    if (this.alternateEvidencePassRadioChecked || this.alternateEvidenceFailRadioChecked) {
      this.formControl.patchValue(this.alternateEvidencePassRadioChecked
        ? AlternateEvidenceTestResult.Pass : AlternateEvidenceTestResult.Fail);
    }
  }

  alternateEvidenceTestResultChanged(result: string): void {
    this.setupControl();
    if (this.formControl.valid) {
      this.formControl.patchValue(result);
      console.log(this.formControl.value);
      this.alternateEvidenceTestResultChange.emit(result === AlternateEvidenceTestResult.Pass);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  descriptionUpdated(event: string) {
    this.alternativeEvidenceUpdate.emit(event);
  }
}
