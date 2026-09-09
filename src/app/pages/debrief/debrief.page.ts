import { Component, OnInit, Signal, computed, effect, inject } from '@angular/core';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { DebriefViewDidEnter, EndDebrief } from '@pages/debrief/debrief.actions';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { getETA, getEco, selectTestData } from '@store/tests/test-data/common/test-data.selector';
import { selectCurrentTest } from '@store/tests/tests.selector';
import { Subscription } from 'rxjs';

import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TranslateService } from '@ngx-translate/core';
import { getTestOutcome } from '@pages/debrief/debrief.selector';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { selectConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { selectUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';

import { Style } from '@capacitor/status-bar';
import { ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { DASHBOARD_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestOutcome } from '@shared/models/test-outcome';
import { getAvoidance, getAvoidanceAttempted } from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.selector';
import { getEmergencyStop } from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.selector';
import { getLessonAndTheme } from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.reducer';
import { getLessonPlanning } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.reducer';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getGrade, getImmediateDanger } from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { getRiskManagement } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.reducer';
import { getTeachingLearningStrategies } from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.reducer';
import { getTotalScore } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.selector';
import { getVehicleChecks } from '@store/tests/test-data/cat-c/test-data.cat-c.selector';
import {
  getQuestion1,
  getQuestion2,
  getQuestion3,
  getQuestion4,
  getQuestion5,
  getTotalPercent,
} from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.selector';
import {
  getSafetyQuestions,
  getSafetyQuestionsCatD,
} from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.selector';
import { TestOutcome as OutcomeType } from '@store/tests/tests.constants';

@Component({
  selector: '.debrief-page',
  templateUrl: 'debrief.page.html',
  styleUrls: ['debrief.page.scss'],
  standalone: false,
})
export class DebriefPage extends PracticeableBasePageComponent implements OnInit, ViewDidEnter, ViewDidLeave {
  private translate = inject(TranslateService);
  private faultCountProvider = inject(FaultCountProvider);
  private faultSummaryProvider = inject(FaultSummaryProvider);
  protected routeByCategoryProvider = inject(RouteByCategoryProvider);
  private testDataByCategoryProvider = inject(TestDataByCategoryProvider);
  private accessibilityService = inject(AccessibilityService);

  subscription: Subscription;
  isPassed: boolean;
  testCategory: TestCategory;

  // Used for now to test displaying pass/fail/terminated messages
  public outcome: string;

  public hasPhysicalEta = false;
  public hasVerbalEta = false;

  public adviceGivenControl = false;
  public adviceGivenPlanning = false;

  currentTest = this.store$.selectSignal(selectCurrentTest);
  category: Signal<CategoryCode> = this.store$.selectSignal(selectTestCategory);
  testData = this.store$.selectSignal(selectTestData);
  conductedLanguage = this.store$.selectSignal(selectConductedLanguage);
  candidateName = this.store$.selectSignal(selectUntitledCandidateName);

  testResult = computed(() => {
    const test = this.currentTest();
    return test ? getTestOutcome(test as never) : null;
  });

  etaFaults = computed(() => getETA(this.testData() as never));
  ecoFaults = computed(() => getEco(this.testData() as never));

  seriousFaults = computed(() => {
    if (!this.testData() || !this.category()) return [];
    return this.faultSummaryProvider
      .getSeriousFaultsList(this.testData() as never, this.category() as TestCategory)
      .map((fault) => fault.competencyIdentifier);
  });

  dangerousFaults = computed(() => {
    if (!this.testData() || !this.category()) return [];
    return this.faultSummaryProvider
      .getDangerousFaultsList(this.testData() as never, this.category() as TestCategory)
      .map((fault) => fault.competencyIdentifier);
  });

  drivingFaults: Signal<FaultSummary[]> = computed(() => {
    if (!this.testData() || !this.category()) return [];
    return this.faultSummaryProvider.getDrivingFaultsList(this.testData() as never, this.category() as TestCategory);
  });

  drivingFaultCount = computed(() => {
    if (!this.testData() || !this.category()) return 0;
    return this.faultCountProvider.getDrivingFaultSumCount(this.category() as TestCategory, this.testData() as never);
  });

  showEco = computed(
    () =>
      !isAnyOf(this.category() as TestCategory, [
        TestCategory.EUAMM1,
        TestCategory.EUA1M1,
        TestCategory.EUA2M1,
        TestCategory.EUAM1,
      ])
  );

  showSpeedCheck = computed(() =>
    isAnyOf(this.category() as TestCategory, [
      TestCategory.EUAMM1,
      TestCategory.EUA1M1,
      TestCategory.EUA2M1,
      TestCategory.EUAM1,
    ])
  );

  emergencyStop = computed(() => getEmergencyStop(this.testData() as never));
  avoidance = computed(() => getAvoidance(this.testData() as never));
  avoidanceAttempted = computed(() => getAvoidanceAttempted(this.avoidance() as never));

  tellMeShowMeQuestions = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    if (!categoryTestData) return [];
    const checks = getVehicleChecks(categoryTestData as never);
    if (!checks) return [];
    return [...checks.tellMeQuestions, ...checks.showMeQuestions].filter((question) => question.code !== undefined);
  });

  question1 = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getQuestion1(categoryTestData as never) : null;
  });

  question2 = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getQuestion2(categoryTestData as never) : null;
  });

  question3 = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getQuestion3(categoryTestData as never) : null;
  });

  question4 = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getQuestion4(categoryTestData as never) : null;
  });

  question5 = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getQuestion5(categoryTestData as never) : null;
  });

  overallScore = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getTotalPercent(categoryTestData as never) : null;
  });

  totalScore = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getTotalScore(categoryTestData as never) : null;
  });

  lessonTheme = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getLessonAndTheme(categoryTestData as never) : null;
  });

  lessonPlanning = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getLessonPlanning(categoryTestData as never) : null;
  });

  riskManagement = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getRiskManagement(categoryTestData as never) : null;
  });

  teachingLearningStrategies = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getTeachingLearningStrategies(categoryTestData as never) : null;
  });

  review = computed(() => {
    const categoryTestData = this.getCategorySpecificTestData();
    return categoryTestData ? getReview(categoryTestData as never) : null;
  });

  showSafetyAndBalance = computed(() =>
    isAnyOf(this.category() as TestCategory, [
      TestCategory.EUAMM2,
      TestCategory.EUA1M2,
      TestCategory.EUA2M2,
      TestCategory.EUAM2,
    ])
  );

  grade = computed(() => {
    if (!isAnyOf(this.category() as TestCategory, [TestCategory.ADI3, TestCategory.SC])) return null;
    const review = this.review();
    return review ? getGrade(review) : null;
  });

  immediateDanger = computed(() => {
    if (!isAnyOf(this.category() as TestCategory, [TestCategory.ADI3, TestCategory.SC])) return null;
    const review = this.review();
    return review ? getImmediateDanger(review) : null;
  });

  safetyQuestions = computed(() => {
    if (
      !isAnyOf(this.category() as TestCategory, [TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E])
    ) {
      return [];
    }
    const categoryTestData = this.getCategorySpecificTestData();
    if (!categoryTestData) return [];
    const safetyQuestionsCatD = getSafetyQuestionsCatD(categoryTestData as never);
    return getSafetyQuestions(safetyQuestionsCatD as never) || [];
  });

  showSafetyQuestions = computed(() => this.safetyQuestions().some((question) => question.outcome));

  private getCategorySpecificTestData() {
    const currentTest = this.currentTest();
    const category = this.category();
    if (!currentTest || !category) {
      return null;
    }
    return this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(currentTest as never);
  }

  constructor() {
    super(false);

    effect(() => {
      const category = this.category();
      this.testCategory = category as TestCategory;
    });

    effect(() => {
      this.outcome = this.testResult();
    });

    effect(() => {
      const eta = this.etaFaults();
      this.hasPhysicalEta = !!eta?.physical;
      this.hasVerbalEta = !!eta?.verbal;
    });

    effect(() => {
      const eco = this.ecoFaults();
      this.adviceGivenControl = !!eco?.adviceGivenControl;
      this.adviceGivenPlanning = !!eco?.adviceGivenPlanning;
    });

    effect(() => {
      const language = this.conductedLanguage();
      if (language) {
        configureI18N(language as Language, this.translate);
      }
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(DebriefViewDidEnter());
  }

  async ionViewDidLeave(): Promise<void> {
    super.ionViewDidLeave();

    if (this.isTestReportPracticeMode && super.isIos()) {
      await ScreenOrientation.unlock();
      await Insomnia.allowSleep();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async endDebrief(): Promise<void> {
    if (this.isTestReportPracticeMode) {
      await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
      await this.accessibilityService.configureStatusBar(Style.Dark);
      return;
    }
    this.store$.dispatch(EndDebrief());

    if (this.outcome === TestOutcome.PASS) {
      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.PASS_FINALISATION_PAGE, this.testCategory);
      return;
    }
    await this.router.navigate([TestFlowPageNames.POST_DEBRIEF_HOLDING_PAGE]);
  }

  isCategoryBTest(): boolean {
    return this.testCategory === TestCategory.B;
  }

  isTerminated(): boolean {
    return this.outcome === OutcomeType.Terminated;
  }

  public isCatD = (): boolean =>
    isAnyOf(this.testCategory, [TestCategory.D, TestCategory.D1, TestCategory.D1E, TestCategory.DE]);

  showCPCDebriefCard(): boolean {
    return isAnyOf(this.testCategory, [TestCategory.CCPC, TestCategory.DCPC]);
  }

  showADI3DebriefCard(): boolean {
    return isAnyOf(this.testCategory, [TestCategory.ADI3, TestCategory.SC]);
  }

  showVehicleChecksArrayCard(): boolean {
    return isAnyOf(this.testCategory, [
      // Cat BE
      TestCategory.BE,
      // Cat C
      TestCategory.C,
      TestCategory.C1,
      TestCategory.CE,
      TestCategory.C1E,
      // Cat D
      TestCategory.D,
      TestCategory.D1,
      TestCategory.DE,
      TestCategory.D1E,
      // Home
      TestCategory.F,
      TestCategory.G,
      TestCategory.H,
      TestCategory.K,
    ]);
  }
}
