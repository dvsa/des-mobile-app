import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
  trDestroy$,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestResultProvider } from '@providers/test-result/test-result';
import { Observable, Subscription } from 'rxjs';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { CalculateTestResult, ReturnToTest, TerminateTestFromTestReport } from '@pages/test-report/test-report.actions';
import { Adi3EndTestModal } from '@pages/test-report/cat-adi-part3/components/adi3-end-test-modal/adi3-end-test-modal';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import {
  LessonAndTheme,
  TestData,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { getTests } from '@store/tests/tests.reducer';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getFeedback } from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { FeedbackChanged, GradeChanged } from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

interface TestReportDashboardState {
  testDataADI3$: Observable<TestData>;
  feedback$: Observable<string>;
}

type TestReportDashboardPageState = CommonTestReportPageState & TestReportDashboardState;

@Component({
  selector: 'app-test-report-dashboard',
  templateUrl: './test-report-dashboard.page.html',
  styleUrls: ['./test-report-dashboard.page.scss'],
})
export class TestReportDashboardPage extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportDashboardPageState;
  localSubscription: Subscription;
  testDataADI3: TestData;
  lessonAndThemeState: { valid: boolean, score: number };
  testReportState: number;
  form: FormGroup;
  feedback: string;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    modalController: ModalController,
    testReportValidatorProvider: TestReportValidatorProvider,
    screenOrientation: ScreenOrientation,
    insomnia: Insomnia,
    routeByCategory: RouteByCategoryProvider,
    private testResultProvider: TestResultProvider,
    private adi3AssessmentProvider: ADI3AssessmentProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      modalController,
      testReportValidatorProvider,
      screenOrientation,
      insomnia,
      routeByCategory,
    );
    this.form = new FormGroup({});
  }

  ngOnInit() {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.localSubscription = currentTest$.pipe(
      select(getTestData),
      takeUntil(trDestroy$),
    ).subscribe((result: TestData) => {
      this.testDataADI3 = result;
      this.lessonAndThemeState = this.validateLessonTheme(result.lessonAndTheme);
      this.testReportState = this.adi3AssessmentProvider.validateTestReport(
        result.lessonPlanning,
        result.riskManagement,
        result.teachingLearningStrategies,
      );
      this.feedback = result.review?.feedback;
    });

    this.pageState = {
      ...this.commonPageState,
      testDataADI3$: currentTest$.pipe(
        select(getTestData),
      ),
      feedback$: currentTest$.pipe(
        select(getTestData),
        select(getReview),
        select(getFeedback),
      ),
    };

    this.setupSubscription();
  }

  async ionViewWillEnter() {
    this.ngOnInit();
    await super.ionViewWillEnter();
    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();

    if (this.localSubscription) {
      this.localSubscription.unsubscribe();
    }
  }

  feedbackChanged = (feedback: string) => {
    this.store$.dispatch(FeedbackChanged(feedback));
  };

  validateLessonTheme({ lessonThemes, other, studentLevel }: LessonAndTheme): { valid: boolean; score: number; } {
    const result: { valid: boolean; score: number } = { valid: false, score: 0 };
    const isOtherPresent = !!other;
    result.valid = !!(studentLevel && (lessonThemes.length > 0 || isOtherPresent));
    result.score = (!studentLevel && lessonThemes.length === 0)
      ? 0
      : studentLevel && (lessonThemes.length > 0 || isOtherPresent) ? 2 : 1;

    return result;
  }

  onContinueClick = async (): Promise<void> => {
    const result = await this.testResultProvider.calculateTestResultADI3(this.testDataADI3).toPromise();
    const totalScore: number = this.adi3AssessmentProvider.getTotalAssessmentScore(this.testDataADI3);

    const modal: HTMLIonModalElement = await this.modalController.create({
      component: Adi3EndTestModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: {
        testData: this.testDataADI3,
        testResult: result,
        totalScore,
        isTestReportPopulated: this.adi3AssessmentProvider.isTestReportPopulated(this.testDataADI3),
        feedback: this.feedback,
        isValidDashboard: this.isValidDashboard,
      },
    });

    await modal.present();
    const { data } = await modal.onDidDismiss<ModalEvent>();
    await this.onModalDismiss(data, result.grade);
  };

  onModalDismiss = async (event: ModalEvent, grade: string = null): Promise<void> => {
    switch (event) {
      case ModalEvent.CONTINUE:
        this.store$.dispatch(GradeChanged(grade));
        this.store$.dispatch(CalculateTestResult());
        await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE]);
        break;
      case ModalEvent.TERMINATE:
        this.store$.dispatch(GradeChanged(null));
        this.store$.dispatch(TerminateTestFromTestReport());
        const populatedTestReport = this.adi3AssessmentProvider.isTestReportPopulated(this.testDataADI3);
        await this.router.navigate(populatedTestReport
          ? [TestFlowPageNames.DEBRIEF_PAGE]
          : [TestFlowPageNames.NON_PASS_FINALISATION_PAGE]);
        break;
      case ModalEvent.CANCEL:
        this.store$.dispatch(ReturnToTest());
        break;
      default:
        break;
    }
  };

  navigateToPage = async (page: 'lessonTheme' | 'testReport') => {
    await this.routeByCategory.navigateToPage(
      TestFlowPageNames.TEST_REPORT_PAGE,
      TestCategory.ADI3,
      { state: { page } },
    );
  };

  get isValidDashboard(): boolean {
    return (
      this.testReportState === 17
      && this.lessonAndThemeState.valid === true
      && this.form.valid
    );
  }
}
