import {
  Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { uniqueId } from 'lodash';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'vehicle-checks-question',
  templateUrl: 'vehicle-checks-question.html',
  styleUrls: ['vehicle-checks-question.scss'],
})
export class VehicleChecksQuestionComponent implements OnChanges, OnInit, OnDestroy {

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
  modalOpened: EventEmitter<void>;

  @Input()
  submitClicked: boolean;

  @Output()
  vehicleChecksQuestionChange = new EventEmitter<QuestionResult>();

  @Output()
  vehicleChecksQuestionOutcomeChange = new EventEmitter<QuestionOutcome>();

  questionFormControl: UntypedFormControl;
  questionOutcomeFormControl: UntypedFormControl;
  private onDestroy$ = new Subject<void>();

  readonly questionId: string = uniqueId();
  readonly questionOutcomeFieldName: string = `vehicleChecksQuestionOutcome_${this.questionId}`;
  readonly questionFieldName: string = `vehicleChecksQuestion_${this.questionId}`;

  ngOnInit() {
    this.modalOpened?.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.setInvalidIfUndefined(this.questionFormControl);
      this.setInvalidIfUndefined(this.questionOutcomeFormControl);
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnChanges(): void {
    if (!this.questionFormControl) {
      this.questionFormControl = new UntypedFormControl({ disabled: true });
      this.formGroup.addControl(this.questionFieldName, this.questionFormControl);
    }

    if (!this.questionOutcomeFormControl) {
      this.questionOutcomeFormControl = new UntypedFormControl();
      this.formGroup.addControl(this.questionOutcomeFieldName, this.questionOutcomeFormControl);
    }

    if (this.questionResult) {
      this.questionFormControl.patchValue(this.findQuestion());
      this.questionOutcomeFormControl.patchValue(this.questionResult.outcome);
    }

    this.setInvalidIfUndefined(this.questionFormControl);
    this.setInvalidIfUndefined(this.questionOutcomeFormControl);
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

  isInvalid(): boolean {
    if (this.submitClicked) {
      return !this.questionFormControl.valid || !this.questionOutcomeFormControl.valid;
    }
    return false;
  }

  displayErrorMessage(): boolean {
    return this.submitClicked && this.questionFormControl.valid && !this.questionOutcomeFormControl.valid;
  }

  setInvalidIfUndefined(control: UntypedFormControl) {
    if (control.value === undefined) {
      control.setErrors({ 'invalid': true });
    }
  }
}
