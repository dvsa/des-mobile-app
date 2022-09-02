import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tr-assessment-answer',
  templateUrl: 'tr-assessment-answer.html',
})
export class TestReportAssessmentAnswer {

  @Input()
  question: string;

  @Input()
  questionNumber: number;

  @Input()
  card: string;

  @Input()
  answer: number;

  @Output()
  answerChanged = new EventEmitter<string>();

  @Input()
  formGroup : FormGroup;

  formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl(this.card + '-' + this.questionNumber, this.formControl);
    }
    this.formControl.patchValue(this.answer);
  }



  valueChanged = (key: string): void => {
    this.answerChanged.emit((Number(key) === this.answer) ? null : key);
  };

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
