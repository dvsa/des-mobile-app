import { Component, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import {
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { EyesightTestReset } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import {
  QuestionOutcomes,
  TellMeQuestionCorrect,
  TellMeQuestionDrivingFault,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import {
  selectIsTellMeQuestionSelected,
  selectTellMeQuestion,
  selectTellMeQuestionOutcome,
} from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { selectInstructorRegistrationNumber } from '@store/tests/instructor-details/instructor-details.selector';
import { QuestionProvider } from '@providers/question/question';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';

@Component({
  selector: 'app-waiting-room-to-car-cat-b',
  templateUrl: './waiting-room-to-car.cat-b.page.html',
  styleUrls: ['./waiting-room-to-car.cat-b.page.scss'],
})
export class WaitingRoomToCarCatBPage extends WaitingRoomToCarBasePageComponent {
  private questionProvider = inject(QuestionProvider);

  form: UntypedFormGroup;
  tellMeQuestions: VehicleChecksQuestion[];
  tellMeQuestion = this.store$.selectSignal(selectTellMeQuestion)();
  tellMeQuestionOutcome = this.store$.selectSignal<string>(selectTellMeQuestionOutcome)();
  tellMeQuestionSelected = this.store$.selectSignal(selectIsTellMeQuestionSelected)();
  instructorRegistrationNumber = this.store$.selectSignal(selectInstructorRegistrationNumber)();

  constructor() {
    super();
    this.tellMeQuestions = this.questionProvider.getTellMeQuestions(TestCategory.B);
    this.form = new UntypedFormGroup({});
  }

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls)
      .forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(ClearCandidateLicenceData());

      await this.routeByCategoryProvider.navigateToPage(
        TestFlowPageNames.TEST_REPORT_PAGE,
        this.testCategory,
        { replaceUrl: true },
      );
      return;
    }

    Object.keys(this.form.controls)
      .forEach((controlName: string) => {
        if (this.form.controls[controlName].invalid) {
          this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
        }
      });
  };

  eyesightFailCancelled = (): void => {
    this.form.get('eyesightCtrl')
      ?.reset();
    this.store$.dispatch(EyesightTestReset());
  };

  tellMeQuestionChanged(newTellMeQuestion: VehicleChecksQuestion): void {
    this.store$.dispatch(TellMeQuestionSelected(newTellMeQuestion));

    if (this.form.controls['tellMeQuestionOutcome']) {
      this.form.controls['tellMeQuestionOutcome'].setValue('');
    }
  }

  tellMeQuestionOutcomeChanged(outcome: string): void {
    if (outcome === QuestionOutcomes.Pass) {
      this.store$.dispatch(TellMeQuestionCorrect());
      return;
    }
    this.store$.dispatch(TellMeQuestionDrivingFault());
  }

}
