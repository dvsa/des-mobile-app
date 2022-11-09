import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'assessment-report',
  templateUrl: 'assessment-report.html',
})
export class AssessmentReportComponent implements OnChanges {

  @Input()
  assessmentReport: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  assessmentReportChange = new EventEmitter<string>();

  private formControl: UntypedFormControl;
  static readonly fieldName: string = 'assessmentReport';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl(AssessmentReportComponent.fieldName, this.formControl);
      this.formGroup.get(AssessmentReportComponent.fieldName).setValidators([Validators.required]);
    }
    this.formControl.patchValue(this.assessmentReport);
  }

  assessmentReportChanged(assessmentReport: string): void {
    this.assessmentReportChange.emit(assessmentReport);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
