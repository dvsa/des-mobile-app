import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { uniqueId } from 'lodash';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

@Component({
  selector: 'vehicle-checks-question-cat-a-mod2',
  templateUrl: 'vehicle-checks-question.html',
  styleUrls: ['vehicle-checks-question.scss'],
})
export class VehicleChecksQuestionCatAMod2Component implements OnChanges {

  @Input()
  questionResult: QuestionResult;

  @Input()
  questions: VehicleChecksQuestion[];

  @Input()
  questionsToDisable: QuestionResult[];

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  isLastQuestion: boolean;

  @Input()
  submitClicked: boolean;

  @Output()
  safetyAndBalanceQuestionChange = new EventEmitter<QuestionResult>();

  @Output()
  safetyAndBalanceQuestionOutcomeChange = new EventEmitter<QuestionOutcome>();

  questionFormControl: UntypedFormControl;
  questionOutcomeFormControl: UntypedFormControl;

  readonly questionId: string = uniqueId();
  readonly questionOutcomeFieldName: string = `safetyAndBalanceQuestionOutcome_${this.questionId}`;
  readonly questionFieldName: string = `safetyAndBalancesQuestion_${this.questionId}`;

  ngOnChanges(): void {
    if (!this.questionFormControl) {
      this.questionFormControl = new UntypedFormControl({ disabled: true }, [Validators.required]);
      this.formGroup.addControl(this.questionFieldName, this.questionFormControl);
    }

    if (!this.questionOutcomeFormControl) {
      this.questionOutcomeFormControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl(this.questionOutcomeFieldName, this.questionOutcomeFormControl);
    }

    if (this.questionResult) {
      this.questionFormControl.patchValue(this.findQuestion());
      this.questionOutcomeFormControl.patchValue(this.questionResult.outcome);
    }
  }

  isOptionDisabled(question: VehicleChecksQuestion): boolean {
    const doesQuestionExist: QuestionResult = this.questionsToDisable.find(
      (questionToDisable) => questionToDisable.code === question.code
        && questionToDisable.code !== this.questionResult.code,
    );
    return doesQuestionExist !== undefined;
  }

  safetyAndBalanceQuestionChanged(safetyAndBalanceQuestion: VehicleChecksQuestion): void {
    if (!safetyAndBalanceQuestion) return;

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
    return this.questions.find((question) => question.code === this.questionResult.code);
  }

  shouldShowOutcomeFields(): boolean {
    return !!(this.questionResult && this.questionResult.code && this.questionResult.description);
  }

  get invalid(): boolean {
    if (this.submitClicked) {
      return !this.questionFormControl.valid || !this.questionOutcomeFormControl.valid;
    }
    return false;
  }

  displayErrorMessage(): boolean {
    if (this.submitClicked) {
      return this.questionFormControl.valid && !this.questionOutcomeFormControl.valid;
    }
    return false;
  }
}
