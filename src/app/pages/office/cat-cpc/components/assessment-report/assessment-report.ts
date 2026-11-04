import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';
import { IonCol, IonRow } from '@ionic/angular';

@Component({
  selector: 'assessment-report',
  templateUrl: 'assessment-report.html',
  imports: [IonRow, FormsModule, ReactiveFormsModule, IonCol, EmojiBlockDirective, PasteSanitiserDirective],
})
export class AssessmentReportComponent implements OnChanges {
  @Input()
  assessmentReport: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  assessmentReportChange = new EventEmitter<string>();

  formControl: UntypedFormControl;
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
