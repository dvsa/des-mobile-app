import { Component, OnInit } from '@angular/core';
import {
  ModalController, NavController, Platform, ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-d';
import { ActivityCodeModel, getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { merge, Observable, Subscription } from 'rxjs';

import { CategoryCode, GearboxCategory, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { FormGroup } from '@angular/forms';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getTestOutcome } from '@store/tests/tests.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { map, withLatestFrom } from 'rxjs/operators';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getTestData } from '@store/tests/test-data/cat-d/test-data.cat-d.reducer';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-d/vehicle-details.cat-d.reducer';
import { getGearboxCategory } from '@store/tests/vehicle-details/vehicle-details.selector';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import { isProvisionalLicenseProvided } from '@store/tests/pass-completion/pass-completion.selector';
import { vehicleChecksExist } from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.selector';
import { getVehicleChecks } from '@store/tests/test-data/cat-d/test-data.cat-d.selector';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { TestOutcome } from '@store/tests/tests.constants';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { PassCertificateNumberChanged } from '@store/tests/pass-completion/pass-completion.actions';
import { PassCertificateNumberReceived } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { startsWith } from 'lodash';
import { AddManoeuvreComment } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { AddUncoupleRecoupleComment } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { AddShowMeTellMeComment } from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';
import { AddPcvDoorExerciseComment } from '@store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise.actions';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { AddSafetyQuestionComment } from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.action';

interface CatDOfficePageState {
  testCategory$: Observable<CategoryCode>;
  delegatedTest$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
  transmission$: Observable<GearboxCategory>;
  provisionalLicense$: Observable<boolean>;
  displayDrivingFaultComments$: Observable<boolean>;
  displayVehicleChecks$: Observable<boolean>;
  vehicleChecks$: Observable<QuestionResult[]>;
}
type OfficePageState = CommonOfficePageState & CatDOfficePageState;

@Component({
  selector: '.office-cat-d-page',
  templateUrl: './office.cat-d.page.html',
  styleUrls: ['../office.page.scss'],
})
export class OfficeCatDPage extends OfficeBasePageComponent implements OnInit {

  pageState: OfficePageState;
  pageSubscription: Subscription;
  form: FormGroup;
  static readonly maxFaultCount = 12;

  activityCodeOptions: ActivityCodeModel[];
  testCategory: CategoryCode;
  isDelegated: boolean;
  testOutcome: string;
  testOutcomeText: string;
  conductedLanguage: string;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    navController: NavController,
    toastController: ToastController,
    modalController: ModalController,
    outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    weatherConditionProvider: WeatherConditionProvider,
    faultSummaryProvider: FaultSummaryProvider,
    faultCountProvider: FaultCountProvider,
    private appConfig: AppConfigProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      navController,
      toastController,
      modalController,
      outcomeBehaviourProvider,
      weatherConditionProvider,
      faultSummaryProvider,
      faultCountProvider,
    );
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = getActivityCodeOptions(this.appConfig.getAppConfig().role === ExaminerRole.DLG);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      ...this.commonPageState,
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
        map((result) => this.testCategory = result),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
      delegatedTest$: currentTest$.pipe(
        select(getDelegatedTestIndicator),
        select(isDelegatedTest),
      ),
      transmission$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleDetails),
        select(getGearboxCategory),
      ),
      provisionalLicense$: currentTest$.pipe(
        select(getPassCompletion),
        map(isProvisionalLicenseProvided),
      ),
      displayDrivingFaultComments$: currentTest$.pipe(
        select(getTestData),
        map((data) => this.shouldDisplayDrivingFaultComments(data)),
      ),
      displayVehicleChecks$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(select(getTestData))),
        map(([outcome, data]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'vehicleChecks', vehicleChecksExist(data.vehicleChecks))),
      ),
      vehicleChecks$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        map((checks) => [...checks.tellMeQuestions, ...checks.showMeQuestions]),
      ),
    };

    this.setupSubscription();
  }

  setupSubscription() {
    super.setupSubscriptions();

    const {
      testCategory$,
      delegatedTest$,
      testOutcome$,
      testOutcomeText$,
      conductedLanguage$,
    } = this.pageState;

    this.pageSubscription = merge(
      conductedLanguage$.pipe(map((result) => this.conductedLanguage = result)),
      testOutcomeText$.pipe(map((result) => this.testOutcomeText = result)),
      testOutcome$.pipe(map((result) => this.testOutcome = result)),
      delegatedTest$.pipe(map((result) => this.isDelegated = result)),
      testCategory$.pipe(map((result) => this.testCategory = result)),
    ).subscribe();
  }

  isPass(): boolean {
    return this.testOutcomeText === TestOutcome.Passed;
  }

  isWelsh(): boolean {
    return this.conductedLanguage === Language.CYMRAEG;
  }

  passCertificateNumberChanged(passCertificateNumber: string): void {
    this.store$.dispatch(PassCertificateNumberChanged(passCertificateNumber));
    this.store$.dispatch(PassCertificateNumberReceived(this.form.get('passCertificateNumberCtrl').valid));
  }

  shouldDisplayDrivingFaultComments = (data: CatDUniqueTypes.TestData): boolean => {
    const drivingFaultCount = this.faultCountProvider.getDrivingFaultSumCount(this.testCategory as TestCategory, data);
    const seriousFaultCount = this.faultCountProvider.getSeriousFaultSumCount(this.testCategory as TestCategory, data);
    const dangerousFaultCount = this.faultCountProvider.getDangerousFaultSumCount(
      this.testCategory as TestCategory, data,
    );

    return dangerousFaultCount === 0 && seriousFaultCount === 0 && (drivingFaultCount > OfficeCatDPage.maxFaultCount);
  };

  dangerousFaultCommentChanged(dangerousFaultComment: FaultSummary) {
    if (dangerousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment),
      );
    } else if (startsWith(dangerousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = dangerousFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(
        AddManoeuvreComment(
          fieldName,
          CompetencyOutcome.D,
          controlOrObservation,
          dangerousFaultComment.comment,
        ),
      );

    } else if (dangerousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(dangerousFaultComment.comment));
    } else if (dangerousFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(dangerousFaultComment.comment));
    } else if (dangerousFaultComment.source === CommentSource.PCV_DOOR_EXERCISE) {
      this.store$.dispatch(AddPcvDoorExerciseComment('dangerousFaultComments', dangerousFaultComment.comment));
    }
  }

  seriousFaultCommentChanged(seriousFaultComment: FaultSummary) {
    if (seriousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddSeriousFaultComment(seriousFaultComment.competencyIdentifier, seriousFaultComment.comment),
      );
    } else if (startsWith(seriousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = seriousFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(AddManoeuvreComment(
        fieldName,
        CompetencyOutcome.S,
        controlOrObservation,
        seriousFaultComment.comment,
      ));

    } else if (seriousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.EYESIGHT_TEST) {
      this.store$.dispatch(EyesightTestAddComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.PCV_DOOR_EXERCISE) {
      this.store$.dispatch(AddPcvDoorExerciseComment('seriousFaultComments', seriousFaultComment.comment));
    }
  }

  drivingFaultCommentChanged(drivingFaultComment: FaultSummary) {
    if (drivingFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDrivingFaultComment(drivingFaultComment.competencyIdentifier, drivingFaultComment.comment),
      );
    } else if (startsWith(drivingFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = drivingFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(
        AddManoeuvreComment(
          fieldName,
          CompetencyOutcome.DF,
          controlOrObservation,
          drivingFaultComment.comment,
        ),
      );

    } else if (drivingFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(drivingFaultComment.comment));
    } else if (drivingFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(drivingFaultComment.comment));
    } else if (drivingFaultComment.source === CommentSource.SAFETY_QUESTIONS) {
      this.store$.dispatch(AddSafetyQuestionComment(drivingFaultComment.comment));
    } else if (drivingFaultComment.source === CommentSource.PCV_DOOR_EXERCISE) {
      this.store$.dispatch(AddPcvDoorExerciseComment('drivingFaultComments', drivingFaultComment.comment));
    }

  }

}
