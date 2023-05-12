import { Platform } from '@ionic/angular';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { DebriefViewDidEnter, EndDebrief } from '@pages/debrief/debrief.actions';
import { merge, Observable, Subscription } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getEco, getETA } from '@store/tests/test-data/common/test-data.selector';
import {
  filter, map, take, tap, withLatestFrom,
} from 'rxjs/operators';
import { Component } from '@angular/core';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';

import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { TranslateService } from '@ngx-translate/core';
import {
  CategoryCode, Eco, ETA, QuestionResult, SafetyQuestionResult,
} from '@dvsa/mes-test-schema/categories/common';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { getTestOutcome } from '@pages/debrief/debrief.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';

import { TestOutcome } from '@shared/models/test-outcome';
import { Router } from '@angular/router';
import { DASHBOARD_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { getVehicleChecks } from '@store/tests/test-data/cat-c/test-data.cat-c.selector';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { Avoidance, EmergencyStop } from '@dvsa/mes-test-schema/categories/AM1';
import { getEmergencyStop } from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.selector';
import { getAvoidance, getAvoidanceAttempted } from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.selector';
import { Question, Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import {
  getQuestion1,
  getQuestion2,
  getQuestion3,
  getQuestion4,
  getQuestion5,
  getTotalPercent,
} from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.selector';
import { TestOutcome as OutcomeType } from '@store/tests/tests.constants';
import { getTotalScore } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.selector';
import { getRiskManagement } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.reducer';
import {
  LessonAndTheme,
  LessonPlanning,
  Review,
  RiskManagement,
  TeachingLearningStrategies,
} from '@dvsa/mes-test-schema/categories/ADI3';
import {
  getTeachingLearningStrategies,
} from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.reducer';
import { getLessonPlanning } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.reducer';
import { getLessonAndTheme } from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.reducer';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getGrade, getImmediateDanger } from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import {
  getSafetyQuestions,
  getSafetyQuestionsCatD,
} from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.selector';

interface DebriefPageState {
  seriousFaults$: Observable<string[]>;
  dangerousFaults$: Observable<string[]>;
  drivingFaults$: Observable<(FaultSummary)[]>;
  drivingFaultCount$: Observable<number>;
  etaFaults$: Observable<ETA>;
  ecoFaults$: Observable<Eco>;
  testResult$: Observable<string>;
  conductedLanguage$: Observable<string>;
  candidateName$: Observable<string>;
  category$: Observable<CategoryCode>;
  tellMeShowMeQuestions$: Observable<QuestionResult[]>;
  showEco$: Observable<boolean>;
  showSpeedCheck$: Observable<boolean>;
  emergencyStop$: Observable<EmergencyStop>;
  avoidance$: Observable<Avoidance>;
  avoidanceAttempted$: Observable<boolean>;
  question1$: Observable<Question>;
  question2$: Observable<Question>;
  question3$: Observable<Question>;
  question4$: Observable<Question>;
  question5$: Observable<Question5>;
  overallScore$: Observable<number>;
  totalScore$: Observable<number>;
  lessonTheme$: Observable<LessonAndTheme>;
  lessonPlanning$: Observable<LessonPlanning>;
  riskManagement$: Observable<RiskManagement>;
  teachingLearningStrategies$: Observable<TeachingLearningStrategies>;
  review$: Observable<Review>;
  showSafetyAndBalance$: Observable<boolean>;
  grade$: Observable<string>;
  immediateDanger$: Observable<boolean>;
  safetyQuestions$: Observable<SafetyQuestionResult[]>;
  showSafetyQuestions$: Observable<boolean>;
}

@Component({
  selector: '.debrief-page',
  templateUrl: 'debrief.page.html',
  styleUrls: ['debrief.page.scss'],
})
export class DebriefPage extends PracticeableBasePageComponent {

  pageState: DebriefPageState;
  subscription: Subscription;
  isPassed: boolean;
  testCategory: TestCategory;

  // Used for now to test displaying pass/fail/terminated messages
  public outcome: string;

  public hasPhysicalEta: boolean = false;
  public hasVerbalEta: boolean = false;

  public adviceGivenControl: boolean = false;
  public adviceGivenPlanning: boolean = false;

  constructor(
    store$: Store<StoreModel>,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    public insomnia: Insomnia,
    private translate: TranslateService,
    private faultCountProvider: FaultCountProvider,
    private faultSummaryProvider: FaultSummaryProvider,
    protected routeByCategoryProvider: RouteByCategoryProvider,
    private testDataByCategoryProvider: TestDataByCategoryProvider,
  ) {
    super(platform, authenticationProvider, router, store$, false);
  }

  ngOnInit(): void {
    super.ngOnInit();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );
    const testCategory$ = currentTest$.pipe(
      select(getTestCategory),
      take(1),
    );

    this.pageState = {
      seriousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(testCategory$),
        map(([data, category]) =>
          this.faultSummaryProvider.getSeriousFaultsList(data, category as TestCategory)
            .map((fault) => fault.competencyIdentifier)),
        take(1),
      ),
      dangerousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(testCategory$),
        map(([data, category]) =>
          this.faultSummaryProvider.getDangerousFaultsList(data, category as TestCategory)
            .map((fault) => fault.competencyIdentifier)),
        take(1),
      ),
      drivingFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(testCategory$),
        map(([data, category]) => this.faultSummaryProvider.getDrivingFaultsList(data, category as TestCategory)),
        take(1),
      ),
      drivingFaultCount$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(testCategory$),
        map(([testData, category]) =>
          this.faultCountProvider.getDrivingFaultSumCount(category as TestCategory, testData)),
        take(1),
      ),
      etaFaults$: currentTest$.pipe(
        select(getTestData),
        select(getETA),
        take(1),
      ),
      ecoFaults$: currentTest$.pipe(
        select(getTestData),
        select(getEco),
        take(1),
      ),
      testResult$: currentTest$.pipe(
        select(getTestOutcome),
        take(1),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
        take(1),
      ),
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
        take(1),
      ),
      category$: testCategory$,
      tellMeShowMeQuestions$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getVehicleChecks),
        map((checks) => [...checks.tellMeQuestions, ...checks.showMeQuestions]),
        map((checks) => checks.filter((c) => c.code !== undefined)),
        take(1),
      ),
      safetyQuestions$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        filter(([, category]) => isAnyOf(category, [
          TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
        ])),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getSafetyQuestionsCatD),
        select(getSafetyQuestions),
        take(1),
      ),
      question1$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getQuestion1),
        take(1),
      ),
      question2$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getQuestion2),
        take(1),
      ),
      question3$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getQuestion3),
        take(1),
      ),
      question4$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getQuestion4),
        take(1),
      ),
      question5$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getQuestion5),
        take(1),
      ),
      overallScore$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getTotalPercent),
        take(1),
      ),
      totalScore$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getTotalScore),
        take(1),
      ),
      lessonTheme$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getLessonAndTheme),
        take(1),
      ),
      lessonPlanning$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getLessonPlanning),
        take(1),
      ),
      riskManagement$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getRiskManagement),
        take(1),
      ),
      teachingLearningStrategies$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getTeachingLearningStrategies),
        take(1),
      ),
      review$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getReview),
        take(1),
      ),
      showEco$: currentTest$.pipe(
        select(getTestCategory),
        // Don't display for MOD1
        map((category) => !isAnyOf(category, [
          TestCategory.EUAMM1, TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1,
        ])),
        take(1),
      ),
      showSpeedCheck$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [
          TestCategory.EUAMM1, TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1,
        ])),
        take(1),
      ),
      showSafetyQuestions$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        filter(([, category]) => isAnyOf(category, [
          TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
        ])),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getSafetyQuestionsCatD),
        select(getSafetyQuestions),
        map((questions) => questions.some((question) => question.outcome)),
        take(1),
      ),
      showSafetyAndBalance$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [
          TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2,
        ])),
        take(1),
      ),
      emergencyStop$: currentTest$.pipe(
        select(getTestData),
        select(getEmergencyStop),
        take(1),
      ),
      avoidance$: currentTest$.pipe(
        select(getTestData),
        select(getAvoidance),
        take(1),
      ),
      avoidanceAttempted$: currentTest$.pipe(
        select(getTestData),
        select(getAvoidance),
        select(getAvoidanceAttempted),
        take(1),
      ),
      grade$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        filter(([, category]) => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getReview),
        select(getGrade),
        take(1),
      ),
      immediateDanger$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        filter(([, category]) => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getReview),
        select(getImmediateDanger),
        take(1),
      ),
    };

    const {
      testResult$,
      etaFaults$,
      ecoFaults$,
      conductedLanguage$,
      category$,
    } = this.pageState;

    this.subscription = merge(
      category$.pipe(map((result) => this.testCategory = result as TestCategory)),
      testResult$.pipe(map((result) => this.outcome = result)),
      etaFaults$.pipe(
        map((eta) => {
          this.hasPhysicalEta = eta?.physical;
          this.hasVerbalEta = eta?.verbal;
        }),
      ),
      ecoFaults$.pipe(
        map((eco) => {
          this.adviceGivenControl = eco?.adviceGivenControl;
          this.adviceGivenPlanning = eco?.adviceGivenPlanning;
        }),
      ),
      conductedLanguage$.pipe(tap((value) => configureI18N(value as Language, this.translate))),
    )
      .subscribe();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(DebriefViewDidEnter());
  }

  async ionViewDidLeave(): Promise<void> {
    super.ionViewDidLeave();

    if (this.isTestReportPracticeMode && super.isIos()) {
      await ScreenOrientation.unlock();
      await this.insomnia.allowSleepAgain();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async endDebrief(): Promise<void> {
    if (this.isTestReportPracticeMode) {
      await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
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

  public isCatD = (): boolean => isAnyOf(this.testCategory, [
    TestCategory.D, TestCategory.D1,
    TestCategory.D1E, TestCategory.DE,
  ]);

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
      TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
      // Cat D
      TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
      // Home
      TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K,
    ]);
  }

}
