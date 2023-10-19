import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { UntypedFormGroup } from '@angular/forms';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Observable } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { getSchoolBike } from '@store/tests/vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.selector';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { EyesightTestReset } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import {
  getSafetyAndBalanceQuestions,
} from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.selector';
import { map } from 'rxjs/operators';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { SafetyAndBalanceQuestions } from '@dvsa/mes-test-schema/categories/AM2';

interface CatMod2WaitingRoomToCarPageState {
  schoolBike$: Observable<boolean>;
  safetyAndBalanceQuestionsScore$: Observable<SafetyQuestionsScore>;
  safetyAndBalanceQuestions$: Observable<SafetyAndBalanceQuestions>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatMod2WaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-a-mod2',
  templateUrl: './waiting-room-to-car.cat-a-mod2.page.html',
  styleUrls: ['./waiting-room-to-car.cat-a-mod2.page.scss'],
})
export class WaitingRoomToCarCatAMod2Page extends WaitingRoomToCarBasePageComponent implements OnInit {
  pageState: WaitingRoomToCarPageState;
  form: UntypedFormGroup;
  submitClicked: boolean;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    routeByCat: RouteByCategoryProvider,
    alertController: AlertController,
    public faultCountProvider: FaultCountProvider,
  ) {
    super(platform, authenticationProvider, router, store$, routeByCat, alertController);
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
      schoolBike$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getSchoolBike),
      ),
      safetyAndBalanceQuestionsScore$: currentTest$.pipe(
        select(getTestData),
        select(getSafetyAndBalanceQuestions),
        map((safetyAndBalanceQuestions) =>
          this.faultCountProvider.getSafetyAndBalanceFaultCount(TestCategory.EUAM2, safetyAndBalanceQuestions)),
      ),
      safetyAndBalanceQuestions$: currentTest$.pipe(
        select(getTestData),
        select(getSafetyAndBalanceQuestions),
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

    this.submitClicked = true;
  };

  eyesightFailCancelled = (): void => {
    this.form.get('eyesightCtrl')
      ?.reset();
    this.store$.dispatch(EyesightTestReset());
  };
}
