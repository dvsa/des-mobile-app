import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { uniqueId } from 'lodash-es';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

@Component({
  selector: 'vehicle-checks-question',
  templateUrl: 'vehicle-checks-question.html',
  styleUrls: ['vehicle-checks-question.scss'],
})
export class VehicleChecksQuestionComponent implements OnChanges {

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
  vehicleChecksQuestionChange = new EventEmitter<QuestionResult>();

  @Output()
  vehicleChecksQuestionOutcomeChange = new EventEmitter<QuestionOutcome>();

  questionFormControl: UntypedFormControl;
  questionOutcomeFormControl: UntypedFormControl;

  readonly questionId: string = uniqueId();
  readonly questionOutcomeFieldName: string = `vehicleChecksQuestionOutcome_${this.questionId}`;
  readonly questionFieldName: string = `vehicleChecksQuestion_${this.questionId}`;

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

  vehicleChecksQuestionChanged(vehicleChecksQuestion: VehicleChecksQuestion): void {
    if (!vehicleChecksQuestion) return;

    const result: QuestionResult = {
      code: vehicleChecksQuestion.code,
      description: vehicleChecksQuestion.shortName,
    };
    this.vehicleChecksQuestionChange.emit(result);
  }

  vehicleChecksPassSelected() {
    const result: QuestionOutcome = CompetencyOutcome.P;
    this.vehicleChecksQuestionOutcomeChange.emit(result);
  }

  vehicleChecksDrivingFaultSelected() {
    const result: QuestionOutcome = CompetencyOutcome.DF;
    this.vehicleChecksQuestionOutcomeChange.emit(result);
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
