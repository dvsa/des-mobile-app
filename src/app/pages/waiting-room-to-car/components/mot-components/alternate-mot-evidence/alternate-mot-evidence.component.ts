import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { IonCol, IonRow } from '@ionic/angular';

enum AlternateEvidenceTestResult {
  Pass = 'P',
  Fail = 'F',
}
@Component({
  selector: 'alternate-mot-evidence',
  templateUrl: './alternate-mot-evidence.component.html',
  styleUrls: ['./alternate-mot-evidence.component.scss'],
  imports: [IonRow, FormsModule, ReactiveFormsModule, IonCol, WarningBannerComponent],
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

  ngOnInit() {
    this.setupControl();
  }

  setupControl(): void {
    if (!this.formControl) {
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
}
