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
import {
  FeedbackChanged,
  GradeChanged,
  ImmediateDangerChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { Code4Modal } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal';
import {
  TestReportDashboardModalOpened,
  TestReportDashboardNavigateToPage,
  TestReportDashboardViewDidEnter,
} from '@pages/test-report-dashboard/test-report-dashboard.actions';

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
  isTestReportPopulated: boolean;
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
    )
      .subscribe((result: TestData) => {
        this.testDataADI3 = result;
        this.lessonAndThemeState = this.validateLessonTheme(result?.lessonAndTheme);
        this.testReportState = this.adi3AssessmentProvider.validateTestReport(
          result.lessonPlanning,
          result.riskManagement,
          result.teachingLearningStrategies,
        );
        this.isTestReportPopulated = this.adi3AssessmentProvider.isTestReportPopulated(this.testDataADI3);
        this.feedback = result?.review?.feedback;
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

  ionViewDidEnter(): void {
    if (!this.subscription || this.subscription.closed) {
      super.setupSubscription();
    }
    this.store$.dispatch(TestReportDashboardViewDidEnter());
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

  isEmpty(text: string): boolean {
    return (!text || text.trim() === '');
  }

  /**
     * Function to detect if a student level has been selected or a lesson theme has been selected or a message is
     * present inside the 'other' box, if none of them are present, we know there are 0 points scored, otherwise, we
     * check to see if they are all present, if they are, we set score to 2, and if not, the section is not complete
     * yet, so we set score to 1
     * @param lessonThemes
     * @param other
     * @param studentLevel
     */
  validateLessonTheme({
    lessonThemes,
    other,
    studentLevel,
  }: LessonAndTheme): { valid: boolean; score: number; } {
    const result: { valid: boolean; score: number } = {
      valid: false,
      score: 0,
    };
    const isOtherPresent = (!!other && !this.isEmpty(other));

    result.valid = !!(studentLevel && (lessonThemes.length > 0 || isOtherPresent));
    result.score = (studentLevel || (lessonThemes.length > 0 || isOtherPresent))
      ? studentLevel && (lessonThemes.length > 0 || isOtherPresent) ? 2 : 1
      : 0;

    return result;
  }

  onContinueClick = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());
    if (this.isTestReportPopulated && this.testDataADI3.riskManagement.score < 8) {
      const code4Modal: HTMLIonModalElement = await this.modalController.create({
        component: Code4Modal,
        cssClass: 'mes-modal-alert text-zoom-regular',
        backdropDismiss: false,
        showBackdrop: true,
      });
      await code4Modal.present();
      const { data } = await code4Modal.onWillDismiss();
      await this.displayEndTestModal(data);
    } else {
      await this.displayEndTestModal();
    }
  };

  displayEndTestModal = async (riskToPublicSafety: boolean = false): Promise<void> => {
    const result = await this.testResultProvider.calculateTestResultADI3(this.testDataADI3).toPromise();
    const totalScore: number = this.adi3AssessmentProvider.getTotalAssessmentScore(this.testDataADI3);
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: Adi3EndTestModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: {
        testState: this.testReportState,
        testData: this.testDataADI3,
        testResult: result,
        totalScore,
        isTestReportPopulated: this.isTestReportPopulated,
        feedback: this.feedback,
        isValidDashboard: this.isValidDashboard,
        riskToPublicSafety,
      },
    });
    await modal.present();
    this.store$.dispatch(TestReportDashboardModalOpened());
    const { data } = await modal.onDidDismiss<ModalEvent>();
    await this.onModalDismiss(data, result.grade, riskToPublicSafety);
  };

  onModalDismiss = async (
    event: ModalEvent,
    grade: string = null,
    riskToPublicSafety: boolean = false,
  ): Promise<void> => {
    switch (event) {
      case ModalEvent.CONTINUE:
        this.store$.dispatch(GradeChanged(grade));
        this.store$.dispatch(CalculateTestResult());
        if (riskToPublicSafety) {
          this.store$.dispatch(SetActivityCode('4'));
        }
        this.store$.dispatch(ImmediateDangerChanged(riskToPublicSafety));
        await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE]);
        break;
      case ModalEvent.TERMINATE:
        this.store$.dispatch(GradeChanged(null));
        this.store$.dispatch(TerminateTestFromTestReport());
        await this.router.navigate(this.isTestReportPopulated
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
    this.store$.dispatch(TestReportDashboardNavigateToPage(page));

    await this.routeByCategory.navigateToPage(
      TestFlowPageNames.TEST_REPORT_PAGE,
      TestCategory.ADI3,
      { state: { page, showMissing: this.testReportState > 0 && this.testReportState < 17 } },
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
