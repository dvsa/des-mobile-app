import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';

import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import {
  EyesightTestFailed,
  EyesightTestPassed, EyesightTestReset,
} from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import {
  QuestionOutcomes,
  TellMeQuestionCorrect, TellMeQuestionDrivingFault, TellMeQuestionSelected,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  getTellMeQuestion,
  getVehicleChecks, isTellMeQuestionSelected,
  tellMeQuestionOutcome,
} from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/observable';
import { getInstructorDetails } from '@store/tests/instructor-details/instructor-details.reducer';
import { getInstructorRegistrationNumber } from '@store/tests/instructor-details/instructor-details.selector';

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

  isPracticeMode: boolean = false; // @TODO - Remove this and read directly from practice base page

  pageState: WaitingRoomToCarPageState;

  form: FormGroup;

  showEyesightFailureConfirmation: boolean = false;

  tellMeQuestions: VehicleChecksQuestion[];

  constructor(
    private navController: NavController,
    routeByCat: RouteByCategoryProvider,
    store$: Store<StoreModel>,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
  ) {
    super(store$, platform, authenticationProvider, router, routeByCat);
  }

  ngOnInit() {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    super.onInitialisation();
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

  ionViewDidEnter(): void {
    super.ionViewDidEnter();
  }

  ionViewWillLeave(): void {
    super.ionViewWillLeave();
  }

  async onSubmit() {
    await super.onSubmitLogic(this.form);
  }

  setEyesightFailureVisibility(show: boolean) {
    this.showEyesightFailureConfirmation = show;
  }

  eyesightFailCancelled = (): void => {
    this.form.get('eyesightCtrl')?.reset();
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

  eyesightTestResultChanged(passed: boolean): void {
    this.store$.dispatch(passed ? EyesightTestPassed() : EyesightTestFailed());
  }

}
