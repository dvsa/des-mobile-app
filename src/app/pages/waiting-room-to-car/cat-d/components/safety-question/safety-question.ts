import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { QuestionOutcome, SafetyQuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { uniqueId } from 'lodash';

@Component({
  selector: 'safety-question',
  templateUrl: 'safety-question.html',
  styleUrls: ['safety-questions.scss'],
})
export class SafetyQuestionComponent implements OnChanges {

  @Input()
  questionResult: SafetyQuestionResult;

  @Input()
  questionIndex: number;

  @Input()
  questions: SafetyQuestionResult[];

  @Input()
  formGroup: FormGroup;

  @Input()
  isLastSafetyQuestion: boolean;

  @Output()
  safetyQuestionOutcomeChange = new EventEmitter<QuestionOutcome>();

  safetyQuestionFormControl: FormControl;
  safetyQuestionOutcomeFormControl: FormControl;

  readonly safetyQuestionId: string = uniqueId();
  readonly safetyQuestionOutcomeFieldName: string = `safetyQuestionOutcome_${this.safetyQuestionId}`;
  readonly safetyQuestionFieldName: string = `safetyQuestion_${this.safetyQuestionId}`;

  ngOnChanges(): void {
    if (!this.safetyQuestionFormControl) {
      this.safetyQuestionFormControl = new FormControl({ disabled: true });
      this.formGroup.addControl(this.safetyQuestionFieldName, this.safetyQuestionFormControl);
    }

    if (!this.safetyQuestionOutcomeFormControl) {
      this.safetyQuestionOutcomeFormControl = new FormControl();
      this.formGroup.addControl(this.safetyQuestionOutcomeFieldName, this.safetyQuestionOutcomeFormControl);
    }

    if (this.questionResult) {
      this.safetyQuestionFormControl.patchValue(this.findQuestion());
      this.safetyQuestionOutcomeFormControl.patchValue(this.questionResult.outcome);
    }
  }

  safetyQuestionsPassSelected() {
    const result: QuestionOutcome = 'P';
    this.safetyQuestionOutcomeChange.emit(result);
  }

  safetyQuestionsDrivingFaultSelected() {
    const result: QuestionOutcome = 'DF';
    this.safetyQuestionOutcomeChange.emit(result);
  }

  findQuestion(): SafetyQuestionResult {
    return this.questions.find((question) => question.description === this.questionResult.description);
  }
}
