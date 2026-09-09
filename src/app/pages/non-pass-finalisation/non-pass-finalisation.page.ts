import { Component, OnInit, Signal, computed, effect } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController } from '@ionic/angular';
import {
  NonPassFinalisationReportActivityCode,
  NonPassFinalisationValidationError,
  NonPassFinalisationViewDidEnter,
} from '@pages/non-pass-finalisation/non-pass-finalisation.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { ActivityCodeFinalisationProvider } from '@providers/activity-code-finalisation/activity-code-finalisation';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { ActivityCodes } from '@shared/models/activity-codes';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { selectCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidateName,
  getCandidatePrn,
  selectUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { selectTestSlotAttributes } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import { isWelshTest as getIsWelshTest } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { EndTimeChanged } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.actions';
import { getTestEndTime } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.selector';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import {
  getFurtherDevelopment,
  getGrade,
  getImmediateDanger,
  getReasonForNoAdviceGiven,
} from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { StartTimeChanged } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.actions';
import { getTestStartTime } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.selector';
import { hasEyesightTestGotSeriousFault } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { selectTestData } from '@store/tests/test-data/common/test-data.selector';
import { D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed } from '@store/tests/test-summary/test-summary.actions';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import { getD255, isDebriefWitnessed } from '@store/tests/test-summary/test-summary.selector';
import {
  getActivityCode,
  getTestOutcome,
  getTestOutcomeText,
  isTestOutcomeSet,
  selectCurrentTest,
} from '@store/tests/tests.selector';
import { Subscription } from 'rxjs';
import { TestFinalisationInvalidTestDataModal } from '../test-report/components/test-finalisation-invalid-test-data-modal/test-finalisation-invalid-test-data-modal';

@Component({
  selector: 'app-non-pass-finalisation',
  templateUrl: './non-pass-finalisation.page.html',
  styleUrls: ['./non-pass-finalisation.page.scss'],
  standalone: false,
})
export class NonPassFinalisationPage extends PracticeableBasePageComponent implements OnInit {
  form: UntypedFormGroup;
  activityCodeOptions: ActivityCodeModel[];
  testData: CatBUniqueTypes.TestData;
  activityCode: ActivityCodeModel;
  subscription: Subscription;
  invalidTestDataModal: HTMLIonModalElement;
  testCategory: CategoryCode;
  scStartTime: string;
  scEndTime: string;

  currentTest = this.store$.selectSignal(selectCurrentTest);
  testCategoryState: Signal<CategoryCode> = this.store$.selectSignal(selectTestCategory);
  testDataState: Signal<CatBUniqueTypes.TestData> = this.store$.selectSignal(selectTestData);
  candidate = this.store$.selectSignal(selectCandidate);
  candidateUntitledName = this.store$.selectSignal(selectUntitledCandidateName);
  testSummary = computed(() => {
    const test = this.currentTest();
    return test ? getTestSummary(test as never) : null;
  });
  testSlotAttributes = this.store$.selectSignal(selectTestSlotAttributes);

  candidateName = computed(() => getCandidateName(this.candidate()));
  candidateDriverNumber = computed(() => formatDriverNumber(getCandidateDriverNumber(this.candidate())));
  prn = computed(() => getCandidatePrn(this.candidate()));
  isTestOutcomeSet = computed(() => {
    const test = this.currentTest();
    return test ? isTestOutcomeSet(test as never) : false;
  });
  testOutcome = computed(() => {
    const test = this.currentTest();
    return test ? getTestOutcome(test as never) : null;
  });
  testOutcomeText = computed(() => {
    const test = this.currentTest();
    return test ? getTestOutcomeText(test) : null;
  });
  activityCodeState = computed(() => {
    const test = this.currentTest();
    return test ? getActivityCode(test as never) : null;
  });
  debriefWitnessed = computed(() => isDebriefWitnessed(this.testSummary()));
  d255 = computed(() => getD255(this.testSummary()));
  isWelshTest = computed(() => getIsWelshTest(this.testSlotAttributes()));
  eyesightTestFailed = computed(() => hasEyesightTestGotSeriousFault(this.testDataState()));
  showADIWarning = computed(() => isAnyOf(this.testCategoryState(), [TestCategory.ADI2]));
  showADI3Field = computed(() => isAnyOf(this.testCategoryState(), [TestCategory.ADI3, TestCategory.SC]));
  isStandardsCheck = computed(() => isAnyOf(this.testCategoryState(), [TestCategory.SC]));

  adi3Review = computed(() => {
    if (!this.showADI3Field()) {
      return null;
    }
    const categoryData = this.getCategorySpecificTestData();
    return categoryData ? getReview(categoryData as never) : null;
  });
  furtherDevelopment = computed(() => {
    const review = this.adi3Review();
    return review ? getFurtherDevelopment(review) : null;
  });
  adviceReason = computed(() => {
    const review = this.adi3Review();
    return review ? getReasonForNoAdviceGiven(review) : null;
  });
  testOutcomeGrade = computed(() => {
    const review = this.adi3Review();
    return review ? getGrade(review) : null;
  });
  immediateDanger = computed(() => {
    const review = this.adi3Review();
    return review ? getImmediateDanger(review) : null;
  });

  displayDebriefWitnessed = computed(() =>
    this.outcomeBehaviourProvider.isVisible(this.testOutcome(), 'debriefWitnessed', this.debriefWitnessed())
  );
  displayD255 = computed(() => this.outcomeBehaviourProvider.isVisible(this.testOutcome(), 'd255', this.d255()));
  displayFurtherDevelopment = computed(() =>
    this.outcomeBehaviourProvider.isVisible(this.testOutcome(), 'furtherDevelopment', this.furtherDevelopment())
  );
  displayAdviceReasonGiven = computed(() =>
    this.outcomeBehaviourProvider.isVisible(this.testOutcome(), 'reasonGiven', this.adviceReason())
  );

  testStartTime = computed(() => {
    if (!this.isStandardsCheck()) {
      return null;
    }
    const categoryData = this.getCategorySpecificTestData();
    const startTime = categoryData ? getTestStartTime(categoryData as never) : null;
    return startTime || new DateTime().toISOString();
  });

  testEndTime = computed(() => {
    if (!this.isStandardsCheck()) {
      return null;
    }
    const categoryData = this.getCategorySpecificTestData();
    const endTime = categoryData ? getTestEndTime(categoryData as never) : null;
    return endTime || new DateTime().add(45, Duration.MINUTE).toISOString();
  });

  constructor(
    public routeByCat: RouteByCategoryProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    public activityCodeFinalisationProvider: ActivityCodeFinalisationProvider,
    public modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private testDataByCategoryProvider: TestDataByCategoryProvider
  ) {
    super(false);
    this.form = new UntypedFormGroup({});
    const { nonPassData } = this.activatedRoute.snapshot.data;
    const [behaviourMap, activityCodeList] = nonPassData;
    this.activityCodeOptions = activityCodeList;
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);

    effect(() => {
      this.testData = this.testDataState();
    });

    effect(() => {
      this.activityCode = this.activityCodeState();
    });

    effect(() => {
      this.testCategory = this.testCategoryState();
    });

    effect(() => {
      this.scStartTime = this.testStartTime();
    });

    effect(() => {
      this.scEndTime = this.testEndTime();
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  private getCategorySpecificTestData() {
    const currentTest = this.currentTest();
    const category = this.testCategoryState();
    if (!currentTest || !category) {
      return null;
    }
    return this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(currentTest as never);
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

  get testDataValidationMsg(): string {
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
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      const testDataIsInvalid = await this.activityCodeFinalisationProvider.testDataIsInvalid(
        this.testCategory,
        this.activityCode.activityCode,
        this.testData
      );

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
    Object.keys(this.form.controls).forEach((controlName) => {
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
      isWelsh ? CandidateChoseToProceedWithTestInWelsh('Cymraeg') : CandidateChoseToProceedWithTestInEnglish('English')
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
      TestCategory.CM,
      TestCategory.C1M,
      TestCategory.CEM,
      TestCategory.C1EM,
      TestCategory.DM,
      TestCategory.D1M,
      TestCategory.DEM,
      TestCategory.D1EM,
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

  async handleBackButtonClicked() {
    //If the test is not and adi 3 test or the test is an adi 3 test and the test has completed,
    // navigate to the debrief page directly.
    if (!this.isADI3() || (this.isADI3() && this.didTestComplete())) {
      await this.navigateToDebrief();
    }
  }
}
