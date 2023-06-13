import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { merge, Observable, Subscription } from 'rxjs';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { UntypedFormGroup } from '@angular/forms';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import {
  getActivityCode,
  getCurrentTest,
  getJournalData,
  getTestOutcome,
  getTestOutcomeText,
  isTestOutcomeSet,
} from '@store/tests/tests.selector';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidatePrn,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getD255, isDebriefWitnessed } from '@store/tests/test-summary/test-summary.selector';
import { isWelshTest } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import {
  getTestSlotAttributes,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { hasEyesightTestGotSeriousFault } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import {
  NonPassFinalisationReportActivityCode,
  NonPassFinalisationValidationError,
  NonPassFinalisationViewDidEnter,
} from '@pages/non-pass-finalisation/non-pass-finalisation.actions';
import { ActivityCodeFinalisationProvider } from '@providers/activity-code-finalisation/activity-code-finalisation';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
// eslint-disable-next-line object-curly-newline
import { D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed } from '@store/tests/test-summary/test-summary.actions';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import {
  getFurtherDevelopment,
  getGrade,
  getImmediateDanger,
  getReasonForNoAdviceGiven,
} from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { ActivityCodes } from '@shared/models/activity-codes';
import { getTestStartTime } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.selector';
import { getTestEndTime } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.selector';
import { StartTimeChanged } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.actions';
import { EndTimeChanged } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.actions';
import * as moment from 'moment';
import {
  TestFinalisationInvalidTestDataModal,
} from '../test-report/components/test-finalisation-invalid-test-data-modal/test-finalisation-invalid-test-data-modal';

interface NonPassFinalisationPageState {
  candidateName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  isTestOutcomeSet$: Observable<boolean>;
  testOutcome$: Observable<string>;
  testOutcomeText$: Observable<string>;
  activityCode$: Observable<ActivityCodeModel>;
  displayDebriefWitnessed$: Observable<boolean>;
  debriefWitnessed$: Observable<boolean>;
  displayD255$: Observable<boolean>;
  d255$: Observable<boolean>;
  isWelshTest$: Observable<boolean>;
  testData$: Observable<CatBUniqueTypes.TestData>;
  slotId$: Observable<string>;
  eyesightTestFailed$: Observable<boolean>;
  testCategory$: Observable<CategoryCode>;
  showADIWarning$: Observable<boolean>;
  showADI3Field$: Observable<boolean>;
  furtherDevelopment$: Observable<boolean>;
  displayFurtherDevelopment$: Observable<boolean>;
  adviceReason$: Observable<string>;
  displayAdviceReasonGiven$: Observable<boolean>;
  testOutcomeGrade$: Observable<string>;
  immediateDanger$: Observable<boolean>;
  prn$: Observable<number>;
  isStandardsCheck$: Observable<boolean>;
  testStartTime$: Observable<string>;
  testEndTime$: Observable<string>;
}

@Component({
  selector: 'app-non-pass-finalisation',
  templateUrl: './non-pass-finalisation.page.html',
  styleUrls: ['./non-pass-finalisation.page.scss'],
})
export class NonPassFinalisationPage extends PracticeableBasePageComponent implements OnInit {

  pageState: NonPassFinalisationPageState;
  form: UntypedFormGroup;
  activityCodeOptions: ActivityCodeModel[];
  slotId: string;
  testData: CatBUniqueTypes.TestData;
  activityCode: ActivityCodeModel;
  subscription: Subscription;
  invalidTestDataModal: HTMLIonModalElement;
  testCategory: CategoryCode;
  scStartTime: string;
  scEndTime: string;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public routeByCat: RouteByCategoryProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    public activityCodeFinalisationProvider: ActivityCodeFinalisationProvider,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private testDataByCategoryProvider: TestDataByCategoryProvider,
  ) {
    super(platform, authenticationProvider, router, store$, false);
    this.form = new UntypedFormGroup({});
    const { nonPassData } = this.route.snapshot.data;
    const [behaviourMap, activityCodeList] = nonPassData;
    this.activityCodeOptions = activityCodeList;
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.ngOnInit();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    const category$ = currentTest$.pipe(select(getTestCategory));

    this.pageState = {
      slotId$: this.store$.pipe(
        select(getTests),
        map((tests) => tests.currentTest.slotId),
      ),
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      candidateDriverNumber$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateDriverNumber),
        map(formatDriverNumber),
      ),
      isTestOutcomeSet$: currentTest$.pipe(
        select(isTestOutcomeSet),
      ),
      testOutcome$: currentTest$.pipe(
        select(getTestOutcome),
      ),
      testOutcomeText$: currentTest$.pipe(
        select(getTestOutcomeText),
      ),
      activityCode$: currentTest$.pipe(
        select(getActivityCode),
      ),
      displayDebriefWitnessed$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(isDebriefWitnessed),
        )),
        map(([outcome, debrief]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'debriefWitnessed', debrief)),
      ),
      debriefWitnessed$: currentTest$.pipe(
        select(getTestSummary),
        select(isDebriefWitnessed),
      ),
      displayD255$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(getD255),
        )),
        map(([outcome, d255]) => this.outcomeBehaviourProvider.isVisible(outcome, 'd255', d255)),
      ),
      d255$: currentTest$.pipe(
        select(getTestSummary),
        select(getD255),
      ),
      isWelshTest$: currentTest$.pipe(
        select(getJournalData),
        select(getTestSlotAttributes),
        select(isWelshTest),
      ),
      testData$: currentTest$.pipe(
        select(getTestData),
      ),
      eyesightTestFailed$: currentTest$.pipe(
        select(getTestData),
        select(hasEyesightTestGotSeriousFault),
      ),
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
      ),
      showADIWarning$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [TestCategory.ADI2])),
      ),
      furtherDevelopment$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getReview),
        select(getFurtherDevelopment),
      ),
      displayFurtherDevelopment$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          withLatestFrom(category$),
          filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
          map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
          select(getReview),
          select(getFurtherDevelopment),
        )),
        map(([outcome, furtherDevelopment]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'furtherDevelopment', furtherDevelopment)),
      ),
      adviceReason$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getReview),
        select(getReasonForNoAdviceGiven),
      ),
      displayAdviceReasonGiven$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          withLatestFrom(category$),
          filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
          map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
          select(getReview),
          select(getReasonForNoAdviceGiven),
        )),
        map(([outcome, noAdviceGivenReason]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'reasonGiven', noAdviceGivenReason)),
      ),
      testOutcomeGrade$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getReview),
        select(getGrade),
      ),
      showADI3Field$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])),
      ),
      immediateDanger$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getReview),
        select(getImmediateDanger),
      ),
      prn$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidatePrn),
      ),
      isStandardsCheck$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [TestCategory.SC])),
      ),
      testStartTime$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getTestStartTime),
        map((time: string) => time || moment()
          .toISOString()),
      ),
      testEndTime$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getTestEndTime),
        map((time: string) => time || moment()
          .add(1, 'hour')
          .toISOString()),
      ),
    };

    const {
      testData$,
      slotId$,
      activityCode$,
      testCategory$,
      testStartTime$,
      testEndTime$,
    } = this.pageState;

    this.subscription = merge(
      slotId$.pipe(map((slotId) => this.slotId = slotId)),
      testData$.pipe(map((testData) => this.testData = testData)),
      activityCode$.pipe(map((activityCode) => this.activityCode = activityCode)),
      testCategory$.pipe(map((result) => this.testCategory = result)),
      testStartTime$.pipe(map((value) => this.scStartTime = value)),
      testEndTime$.pipe(map((value) => this.scEndTime = value)),
    )
      .subscribe();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(NonPassFinalisationViewDidEnter());
    if (this.testCategory === TestCategory.ADI2) {
      this.store$.dispatch(D255No());
    }
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openTestDataValidationModal = async (): Promise<void> => {
    this.invalidTestDataModal = await this.modalController.create({
      id: 'TestFinalisationInvalidTestDataModal',
      component: TestFinalisationInvalidTestDataModal,
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        onCancel: this.onCancel,
        onReturnToTestReport: this.onReturnToTestReport,
        message: this.testDataValidationMsg,
      },
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await this.invalidTestDataModal.present();
  };

  private get testDataValidationMsg(): string {
    switch (this.testCategory) {
      case TestCategory.ADI3:
      case TestCategory.SC:
        return 'Code 4 cannot be selected because the PDI has a Risk Management score of more than 7';
      default:
        return 'The level of faults on this practical test does not meet the requirement for code 4 or 5.';
    }
  }

  onCancel = async (): Promise<void> => {
    await this.invalidTestDataModal.dismiss();
  };

  onReturnToTestReport = async (): Promise<void> => {
    await this.invalidTestDataModal.dismiss();

    if (this.testCategory === TestCategory.ADI3) {
      await this.routeByCat.navigateToPage(TestFlowPageNames.TEST_REPORT_DASHBOARD_PAGE);
      return;
    }

    await this.routeByCat.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.testCategory as TestCategory);
  };

  async continue() {
    Object.keys(this.form.controls)
      .forEach((controlName) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      const testDataIsInvalid = await this.activityCodeFinalisationProvider
        .testDataIsInvalid(this.testCategory, this.activityCode.activityCode, this.testData);

      if (testDataIsInvalid) {
        await this.openTestDataValidationModal();
        return;
      }

      this.testStartTimeChanged(this.scStartTime);
      this.testEndTimeChanged(this.scEndTime);

      this.store$.dispatch(NonPassFinalisationReportActivityCode(this.activityCode.activityCode));
      await this.routeByCat.navigateToPage(TestFlowPageNames.CONFIRM_TEST_DETAILS_PAGE);
      return;
    }
    Object.keys(this.form.controls)
      .forEach((controlName) => {
        if (this.form.controls[controlName].invalid) {
          this.store$.dispatch(NonPassFinalisationValidationError(`${controlName} is blank`));
        }
      });
  }

  activityCodeChanged(activityCodeModel: ActivityCodeModel) {
    this.activityCode = activityCodeModel;
    this.store$.dispatch(SetActivityCode(activityCodeModel.activityCode));
  }

  debriefWitnessedChanged(debriefWitnessed: boolean): void {
    this.store$.dispatch(debriefWitnessed ? DebriefWitnessed() : DebriefUnWitnessed());
  }

  d255Changed(d255: boolean): void {
    this.store$.dispatch(d255 ? D255Yes() : D255No());
  }

  furtherDevelopmentChanged(furtherDevelopment: boolean): void {
    this.store$.dispatch(SeekFurtherDevelopmentChanged(furtherDevelopment));
  }

  adviceReasonChanged(adviceReason: string): void {
    this.store$.dispatch(ReasonForNoAdviceGivenChanged(adviceReason));
  }

  isWelshChanged(isWelsh: boolean) {
    this.store$.dispatch(
      isWelsh
        ? CandidateChoseToProceedWithTestInWelsh('Cymraeg')
        : CandidateChoseToProceedWithTestInEnglish('English'),
    );
  }

  testStartTimeChanged(startTime: string): void {
    this.scStartTime = startTime;
    this.store$.dispatch(StartTimeChanged(startTime));
  }

  testEndTimeChanged(endTime: string): void {
    this.scEndTime = endTime;
    this.store$.dispatch(EndTimeChanged(endTime));
  }

  async navigateToDebrief(): Promise<void> {
    await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE]);
  }

  showLanguage = (): boolean => {
    return !isAnyOf(this.testCategory, [TestCategory.ADI3]);
  };

  showD255 = (): boolean => {
    return !isAnyOf(this.testCategory, [
      TestCategory.ADI2,
      TestCategory.ADI3,
      TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
      TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
    ]);
  };

  didTestComplete = (): boolean => {
    if (this.activityCode) {
      return isAnyOf(this.activityCode.activityCode, [
        ActivityCodes.FAIL,
        ActivityCodes.FAIL_PUBLIC_SAFETY,
        ActivityCodes.FAIL_CANDIDATE_STOPS_TEST,
      ]);
    }
    return false;
  };

  isADI3 = (): boolean => {
    return isAnyOf(this.testCategory, [TestCategory.ADI3, TestCategory.SC]);
  };
}
