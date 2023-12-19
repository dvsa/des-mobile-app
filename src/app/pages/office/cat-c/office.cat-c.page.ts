import { Component, Injector, OnInit } from '@angular/core';
import { map, withLatestFrom } from 'rxjs/operators';
import { merge, Observable, Subscription } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { CategoryCode, GearboxCategory, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { startsWith } from 'lodash-es';

import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-c';
import { ActivityCodeModel, getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { getGearboxCategory } from '@store/tests/vehicle-details/vehicle-details.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getTestOutcome } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-c/test-data.cat-c.reducer';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getPassCompletion } from '@store/tests/pass-completion/cat-c/pass-completion.cat-c.reducer';
import { isProvisionalLicenseProvided } from '@store/tests/pass-completion/pass-completion.selector';
import { TestOutcome } from '@store/tests/tests.constants';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { AddManoeuvreComment } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { AddUncoupleRecoupleComment } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { AddShowMeTellMeComment } from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { PassCertificateNumberChanged } from '@store/tests/pass-completion/pass-completion.actions';
import { PassCertificateNumberReceived } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { vehicleChecksExist } from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.selector';
import { getVehicleChecks } from '@store/tests/test-data/cat-c/test-data.cat-c.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-c/vehicle-details.cat-c.reducer';

interface CatCOfficePageState {
  testCategory$: Observable<CategoryCode>;
  delegatedTest$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
  transmission$: Observable<GearboxCategory>;
  provisionalLicense$: Observable<boolean>;
  displayDrivingFaultComments$: Observable<boolean>;
  displayVehicleChecks$: Observable<boolean>;
  vehicleChecks$: Observable<QuestionResult[]>;
}

type OfficePageState = CommonOfficePageState & CatCOfficePageState;

@Component({
  selector: '.office-cat-c-page',
  templateUrl: './office.cat-c.page.html',
  styleUrls: ['../office.page.scss'],
})
export class OfficeCatCPage extends OfficeBasePageComponent implements OnInit {

  pageState: OfficePageState;
  pageSubscription: Subscription;
  form: UntypedFormGroup;
  static readonly maxFaultCount = 12;

  activityCodeOptions: ActivityCodeModel[];
  testCategory: CategoryCode;
  isDelegated: boolean;
  testOutcome: string;
  testOutcomeText: string;
  conductedLanguage: string;

  constructor(
    private appConfig: AppConfigProvider,
    injector: Injector,
  ) {
    super(injector);
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = getActivityCodeOptions(this.appConfig.getAppConfig()?.role === ExaminerRole.DLG);
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
        select(getVehicleDetails),
        select(getGearboxCategory),
      ),
      provisionalLicense$: currentTest$.pipe(
        select(getPassCompletion),
        map(isProvisionalLicenseProvided),
      ),
      displayDrivingFaultComments$: currentTest$.pipe(
        select(getTestData),
        map((data) => this.faultCountProvider.shouldDisplayDrivingFaultComments(
          data,
          TestCategory.C,
          OfficeCatCPage.maxFaultCount,
        )),
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
    )
      .subscribe();
  }

  async ionViewWillEnter() {
    super.ionViewWillEnter();

    if (!this.isPracticeMode && super.isIos()) {
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();

    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
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

  dangerousFaultCommentChanged(dangerousFaultComment: FaultSummary) {
    if (dangerousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment),
      );
      // @TODO Verify if functionality is needed due to maneuvers being moved
    } else if (startsWith(dangerousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = dangerousFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(AddManoeuvreComment(
        fieldName,
        CompetencyOutcome.D,
        controlOrObservation,
        dangerousFaultComment.comment,
      ));

    } else if (dangerousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(dangerousFaultComment.comment));

    } else if (dangerousFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(dangerousFaultComment.comment));
    }
  }

  seriousFaultCommentChanged(seriousFaultComment: FaultSummary) {
    if (seriousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddSeriousFaultComment(seriousFaultComment.competencyIdentifier, seriousFaultComment.comment),
      );
      // @TODO Verify if functionality is needed due to maneuvers being moved
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
    }
  }

  drivingFaultCommentChanged(drivingFaultComment: FaultSummary) {
    if (drivingFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDrivingFaultComment(drivingFaultComment.competencyIdentifier, drivingFaultComment.comment),
      );
      // @TODO Verify if functionality is needed due to maneuvers being moved
    } else if (startsWith(drivingFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = drivingFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(AddManoeuvreComment(
        fieldName,
        CompetencyOutcome.DF,
        controlOrObservation,
        drivingFaultComment.comment,
      ));

    } else if (drivingFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(drivingFaultComment.comment));
    } else if (drivingFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(drivingFaultComment.comment));
    }
  }
}
