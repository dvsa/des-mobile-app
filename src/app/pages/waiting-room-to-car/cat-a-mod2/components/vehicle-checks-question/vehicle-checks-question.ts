import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleChecksQuestion } from '../../../../../providers/question/vehicle-checks-question.model';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { uniqueId } from 'lodash';

@Component({
  selector: 'vehicle-checks-question',
  templateUrl: 'vehicle-checks-question.html',
})
export class VehicleChecksQuestionComponent implements OnChanges {

  @Input()
  questionResult: QuestionResult;

  @Input()
  questions: VehicleChecksQuestion[];

  @Input()
  questionsToDisable: QuestionResult[];

  @Input()
  formGroup: FormGroup;

  @Input()
  isLastQuestion: boolean;

  @Output()
  safetyAndBalanceQuestionChange = new EventEmitter<QuestionResult>();

  @Output()
  safetyAndBalanceQuestionOutcomeChange = new EventEmitter<QuestionOutcome>();

  private questionFormControl: FormControl;
  private questionOutcomeFormControl: FormControl;

  readonly questionId: string = uniqueId();
  readonly questionOutcomeFieldName: string = `safetyAndBalanceQuestionOutcome_${this.questionId}`;
  readonly questionFieldName: string = `safetyAndBalancesQuestion_${this.questionId}`;

  ngOnChanges(): void {
    if (!this.questionFormControl) {
      this.questionFormControl = new FormControl({ disabled: true });
      this.formGroup.addControl(this.questionFieldName, this.questionFormControl);
    }

    if (!this.questionOutcomeFormControl) {
      this.questionOutcomeFormControl = new FormControl();
      this.formGroup.addControl(this.questionOutcomeFieldName, this.questionOutcomeFormControl);
    }

    if (this.questionResult) {
      this.questionFormControl.patchValue(this.findQuestion());
      this.questionOutcomeFormControl.patchValue(this.questionResult.outcome);
    }
  }

  isOptionDisabled(question: VehicleChecksQuestion): boolean {
    const doesQuestionExist: QuestionResult =
      this.questionsToDisable.find(
        questionToDisable => questionToDisable.code === question.code &&
        questionToDisable.code !== this.questionResult.code);
    return doesQuestionExist !== undefined;
  }

  safetyAndBalanceQuestionChanged(safetyAndBalanceQuestion: VehicleChecksQuestion): void {

    const result: QuestionResult = {
      code: safetyAndBalanceQuestion.code,
      description: safetyAndBalanceQuestion.shortName,
    };
    this.safetyAndBalanceQuestionChange.emit(result);
  }

  safetyAndBalancePassSelected() {
    const result: QuestionOutcome = 'P';
    this.safetyAndBalanceQuestionOutcomeChange.emit(result);
  }

  safetyAndBalanceDrivingFaultSelected() {
    const result: QuestionOutcome = 'DF';
    this.safetyAndBalanceQuestionOutcomeChange.emit(result);
  }

  findQuestion(): VehicleChecksQuestion {
    return this.questions.find(question => question.code === this.questionResult.code);
  }

  shouldShowOutcomeFields(): boolean {
    if (this.questionResult && this.questionResult.code && this.questionResult.description) {
      return true;
    }
    return false;
  }
}
