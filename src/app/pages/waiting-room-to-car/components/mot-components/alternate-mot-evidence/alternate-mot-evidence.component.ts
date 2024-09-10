import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  alternateEvidenceChange = new EventEmitter<boolean>();
  @Output()
  alternativeEvidenceDescriptionUpdate = new EventEmitter<string>();

  ngOnInit() {
    this.setupControl();
  }

  setupControl(): void {
    if (!this.formControl) {
      this.formControl = null;
      this.formControl = new UntypedFormControl('', [Validators.required]);
      if (this.formGroup.contains('alternateEvidenceCtrl')) {
        this.formGroup.setControl('alternateEvidenceCtrl', this.formControl);
      } else {
        this.formGroup.addControl('alternateEvidenceCtrl', this.formControl);
      }
    }
    if (this.alternateEvidencePassRadioChecked || this.alternateEvidenceFailRadioChecked) {
      this.formControl.patchValue(
        this.alternateEvidencePassRadioChecked ? AlternateEvidenceTestResult.Pass : AlternateEvidenceTestResult.Fail
      );
    }
  }

  alternateEvidenceTestResultChanged(result: string): void {
    this.setupControl();
    if (this.formControl.valid) {
      this.formControl.patchValue(result);
      this.alternateEvidenceChange.emit(result === AlternateEvidenceTestResult.Pass);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  descriptionUpdated(event: string) {
    this.alternativeEvidenceDescriptionUpdate.emit(event);
  }
}
