import { Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import {
  CommonWaitingRoomToCarPageState,
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
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  getTellMeQuestion,
  getVehicleChecks,
  isTellMeQuestionSelected,
  tellMeQuestionOutcome,
} from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getInstructorDetails } from '@store/tests/instructor-details/instructor-details.reducer';
import { getInstructorRegistrationNumber } from '@store/tests/instructor-details/instructor-details.selector';
import { QuestionProvider } from '@providers/question/question';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';

interface CatBWaitingRoomToCarPageState {
  tellMeQuestion$: Observable<VehicleChecksQuestion>;
  tellMeQuestionOutcome$: Observable<string>;
  tellMeQuestionSelected$: Observable<boolean>;
  instructorRegistrationNumber$: Observable<number>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatBWaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-b',
  templateUrl: './waiting-room-to-car.cat-b.page.html',
  styleUrls: ['./waiting-room-to-car.cat-b.page.scss'],
})
export class WaitingRoomToCarCatBPage extends WaitingRoomToCarBasePageComponent implements OnInit {

  pageState: WaitingRoomToCarPageState;
  form: UntypedFormGroup;
  tellMeQuestions: VehicleChecksQuestion[];

  constructor(
    private questionProvider: QuestionProvider,
    injector: Injector,
  ) {
    super(injector);
    this.tellMeQuestions = this.questionProvider.getTellMeQuestions(TestCategory.B);
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      ...this.commonPageState,
      tellMeQuestion$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        map(getTellMeQuestion),
      ),
      tellMeQuestionOutcome$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        map(tellMeQuestionOutcome),
      ),
      tellMeQuestionSelected$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        map(isTellMeQuestionSelected),
      ),
      instructorRegistrationNumber$: currentTest$.pipe(
        select(getInstructorDetails),
        map(getInstructorRegistrationNumber),
      ),
    };
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
