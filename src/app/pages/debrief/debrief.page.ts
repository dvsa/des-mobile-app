import { Component, OnInit, Signal, computed, effect, inject } from '@angular/core';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { DebriefViewDidEnter, EndDebrief } from '@pages/debrief/debrief.actions';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { getETA, getEco, selectTestData } from '@store/tests/test-data/common/test-data.selector';
import { selectCurrentTest } from '@store/tests/tests.selector';

import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { getTestOutcome } from '@pages/debrief/debrief.selector';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { selectConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { selectUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';

import { NgClass } from '@angular/common';
import { Style } from '@capacitor/status-bar';
import { Adi3DebriefCard } from '@components/common/adi3-debrief-card/adi3-debrief-card';
import { CPCDebriefCardComponent } from '@components/common/cpc-debrief-card/cpc-debrief-card';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar,
  ViewDidEnter,
  ViewDidLeave,
} from '@ionic/angular';
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
import { DangerousFaultsDebriefCardComponent } from './components/dangerous-faults-debrief-card/dangerous-faults-debrief-card';
import { DrivingFaultsDebriefCardComponent } from './components/driving-faults-debrief-card/driving-faults-debrief-card';
import { EcoDebriefCardComponent } from './components/eco-debrief-card/eco-debrief-card';
import { EtaDebriefCardComponent } from './components/eta-debrief-card/eta-debrief-card';
import { SafetyAndBalanceCardCatAMod2Component } from './components/safety-and-balance-card/safety-and-balance-card.cat-a-mod2';
import { SafetyQuestionsCardComponent } from './components/safety-questions-card/safety-questions-card';
import { SeriousFaultsDebriefCardComponent } from './components/serious-faults-debrief-card/serious-faults-debrief-card';
import { SpeedCheckDebriefCardComponent } from './components/speed-check-debrief-card/speed-check-debrief-card';
import { TestOutcomeDebriefCardComponent } from './components/test-outcome-debrief-card/test-outcome-debrief-card';
import { VehicleChecksCardCatBComponent } from './components/vehicle-checks-card-cat-b/vehicle-checks-card.cat-b';
import { VehicleChecksCardComponent } from './components/vehicle-checks-card/vehicle-checks-card';

@Component({
  selector: '.debrief-page',
  templateUrl: 'debrief.page.html',
  styleUrls: ['debrief.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    TestOutcomeDebriefCardComponent,
    SpeedCheckDebriefCardComponent,
    EtaDebriefCardComponent,
    DangerousFaultsDebriefCardComponent,
    SeriousFaultsDebriefCardComponent,
    DrivingFaultsDebriefCardComponent,
    EcoDebriefCardComponent,
    VehicleChecksCardCatBComponent,
    VehicleChecksCardComponent,
    CPCDebriefCardComponent,
    SafetyQuestionsCardComponent,
    SafetyAndBalanceCardCatAMod2Component,
    Adi3DebriefCard,
    IonFooter,
    IonRow,
    IonCol,
    IonButton,
    IonText,
    AddOrRemoveLangCyDirective,
    TranslatePipe,
  ],
})
export class DebriefPage extends PracticeableBasePageComponent implements OnInit, ViewDidEnter, ViewDidLeave {
  private translate = inject(TranslateService);
  private faultCountProvider = inject(FaultCountProvider);
  private faultSummaryProvider = inject(FaultSummaryProvider);
  protected routeByCategoryProvider = inject(RouteByCategoryProvider);
  private testDataByCategoryProvider = inject(TestDataByCategoryProvider);
  private accessibilityService = inject(AccessibilityService);

  currentTest = this.store$.selectSignal(selectCurrentTest);
  category: Signal<CategoryCode> = this.store$.selectSignal(selectTestCategory);
  testData = this.store$.selectSignal(selectTestData);
  conductedLanguage = this.store$.selectSignal(selectConductedLanguage);
  candidateName = this.store$.selectSignal(selectUntitledCandidateName);

  outcome: Signal<string> = computed(() => {
    const test = this.currentTest();
    return test ? getTestOutcome(test as never) : null;
  });

  etaFaults = computed(() => getETA(this.testData() as never));
  ecoFaults = computed(() => getEco(this.testData() as never));
  hasPhysicalEta = computed(() => !!this.etaFaults()?.physical);
  hasVerbalEta = computed(() => !!this.etaFaults()?.verbal);
  adviceGivenControl = computed(() => !!this.ecoFaults()?.adviceGivenControl);
  adviceGivenPlanning = computed(() => !!this.ecoFaults()?.adviceGivenPlanning);

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
  }

  async endDebrief(): Promise<void> {
    if (this.isTestReportPracticeMode) {
      await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
      await this.accessibilityService.configureStatusBar(Style.Dark);
      return;
    }
    this.store$.dispatch(EndDebrief());

    if (this.outcome() === TestOutcome.PASS) {
      await this.routeByCategoryProvider.navigateToPage(
        TestFlowPageNames.PASS_FINALISATION_PAGE,
        this.category() as TestCategory
      );
      return;
    }
    await this.router.navigate([TestFlowPageNames.POST_DEBRIEF_HOLDING_PAGE]);
  }

  isCategoryBTest(): boolean {
    return this.category() === TestCategory.B;
  }

  isTerminated(): boolean {
    return this.outcome() === OutcomeType.Terminated;
  }

  public isCatD = (): boolean =>
    isAnyOf(this.category() as TestCategory, [TestCategory.D, TestCategory.D1, TestCategory.D1E, TestCategory.DE]);

  showCPCDebriefCard(): boolean {
    return isAnyOf(this.category() as TestCategory, [TestCategory.CCPC, TestCategory.DCPC]);
  }

  showADI3DebriefCard(): boolean {
    return isAnyOf(this.category() as TestCategory, [TestCategory.ADI3, TestCategory.SC]);
  }

  showVehicleChecksArrayCard(): boolean {
    return isAnyOf(this.category() as TestCategory, [
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
