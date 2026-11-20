import { NgClass } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { LessonAndTheme } from '@dvsa/mes-test-schema/categories/ADI3';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonButton, IonCol, IonContent, IonFooter, IonHeader, IonRow, IonText, IonToolbar } from '@ionic/angular';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  TestReportDashboardModalOpened,
  TestReportDashboardNavigateToPage,
  TestReportDashboardViewDidEnter,
} from '@pages/test-report-dashboard/test-report-dashboard.actions';
import { Adi3EndTestModal } from '@pages/test-report/cat-adi-part3/components/adi3-end-test-modal/adi3-end-test-modal';
import { Code4Modal } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal';
import { CalculateTestResult, ReturnToTest, TerminateTestFromTestReport } from '@pages/test-report/test-report.actions';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import {
  FeedbackChanged,
  GradeChanged,
  ImmediateDangerChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getFeedback } from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { firstValueFrom } from 'rxjs';
import { TimerComponent } from '../test-report/components/timer/timer';
import { DashboardItemComponent } from './components/dashboard-item/dashboard-item';
import { ReviewFeedback } from './components/review-feedback/review-feedback';

@Component({
  selector: 'app-test-report-dashboard',
  templateUrl: './test-report-dashboard.page.html',
  styleUrls: ['./test-report-dashboard.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    IonRow,
    IonCol,
    TimerComponent,
    DashboardItemComponent,
    ReviewFeedback,
    IonFooter,
    IonButton,
    IonText,
  ],
})
export class TestReportDashboardPage extends TestReportBasePageComponent implements OnInit {
  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  readonly testDataADI3 = computed(() => getTestData(this.currentTest()));
  readonly feedback = computed(() => getFeedback(getReview(this.testDataADI3())));
  readonly lessonAndThemeState = computed(() => this.validateLessonTheme(this.testDataADI3().lessonAndTheme));
  readonly isTestReportPopulated = computed(() =>
    this.adi3AssessmentProvider.isTestReportPopulated(this.testDataADI3())
  );
  readonly testReportState = computed(() =>
    this.adi3AssessmentProvider.validateTestReport(
      this.testDataADI3().lessonPlanning,
      this.testDataADI3().riskManagement,
      this.testDataADI3().teachingLearningStrategies
    )
  );
  form: UntypedFormGroup;
  hasClickedComplete = signal(false);

  constructor(
    private testResultProvider: TestResultProvider,
    private adi3AssessmentProvider: ADI3AssessmentProvider
  ) {
    super();
    this.form = new UntypedFormGroup({});
  }

  get isValidDashboard(): boolean {
    return this.testReportState() === 17 && this.lessonAndThemeState().valid === true && this.form.valid;
  }

  ngOnInit() {
    super.onInitialisation();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(TestReportDashboardViewDidEnter());
  }

  async ionViewWillEnter() {
    await super.ionViewWillEnter();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
  }

  feedbackChanged = (feedback: string) => {
    this.store$.dispatch(FeedbackChanged(feedback));
  };

  isEmpty(text: string): boolean {
    return !text || text.trim() === '';
  }

  validateLessonTheme({ lessonThemes, other, studentLevel }: LessonAndTheme): { valid: boolean; score: number } {
    const result: { valid: boolean; score: number } = {
      valid: false,
      score: 0,
    };
    const isOtherPresent = !!other && !this.isEmpty(other);

    result.valid = !!(studentLevel && (lessonThemes.length > 0 || isOtherPresent));
    result.score =
      studentLevel || lessonThemes.length > 0 || isOtherPresent
        ? studentLevel && (lessonThemes.length > 0 || isOtherPresent)
          ? 2
          : 1
        : 0;

    return result;
  }

  onContinueClick = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());
    this.hasClickedComplete.set(true);
    if (this.isTestReportPopulated() && this.testDataADI3().riskManagement.score < 8) {
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

  displayEndTestModal = async (riskToPublicSafety = false): Promise<void> => {
    const result = await firstValueFrom(this.testResultProvider.calculateTestResultADI3(this.testDataADI3()));

    const totalScore: number = this.adi3AssessmentProvider.getTotalAssessmentScore(this.testDataADI3());
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: Adi3EndTestModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: {
        testState: this.testReportState(),
        testData: this.testDataADI3(),
        testResult: result,
        totalScore,
        isTestReportPopulated: this.isTestReportPopulated(),
        feedback: this.feedback(),
        isValidDashboard: this.isValidDashboard,
        riskToPublicSafety,
      },
    });
    await modal.present();
    this.store$.dispatch(TestReportDashboardModalOpened());
    const { data } = await modal.onDidDismiss<ModalEvent>();
    await this.onModalDismiss(data, result.grade, riskToPublicSafety);
  };

  onModalDismiss = async (event: ModalEvent, grade: string = null, riskToPublicSafety = false): Promise<void> => {
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
        await this.router.navigate(
          this.isTestReportPopulated()
            ? [TestFlowPageNames.DEBRIEF_PAGE]
            : [TestFlowPageNames.NON_PASS_FINALISATION_PAGE]
        );
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
    await this.routeByCategory.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.category as TestCategory, {
      state: {
        page,
        showMissing: this.testReportState() > 0 && this.testReportState() < 17,
      },
    });
  };
}
