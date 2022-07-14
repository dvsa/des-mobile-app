import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
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
import { ReturnToTest } from '@pages/test-report/test-report.actions';
import { Adi3EndTestModal } from '@pages/test-report/cat-adi-part3/components/adi3-end-test-modal/adi3-end-test-modal';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import {
  LessonPlanning,
  LessonTheme,
  RiskManagement,
  TeachingLearningStrategies, TestData,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { getTests } from '@store/tests/tests.reducer';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

interface TestReportDashboardState {
  testDataADI3$: Observable<TestData>;
}

interface TestReportDashboardState {}
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
  lessonAndThemeState: {
    valid: boolean,
    score: number,
  };
  testReportState: number;

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
  }

  ngOnInit() {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.localSubscription = currentTest$.pipe(
      select(getTestData),
    ).subscribe((result: TestData) => {
      this.testDataADI3 = result;
      this.lessonAndThemeState = this.validateLessonTheme(result.lessonAndTheme);
      this.testReportState = this.validateTestReport(
        result.lessonPlanning,
        result.riskManagement,
        result.teachingLearningStrategies,
      );

    });

    this.pageState = {
      ...this.commonPageState,
      testDataADI3$: currentTest$.pipe(
        select(getTestData),
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

  validateLessonTheme(
    data: { lessonThemes?: LessonTheme[],
      other?: string,
      studentLevel?: string },
  ): { valid: boolean, score: number } {
    const result: { valid: boolean; score: number } = { valid: false, score: 0 };
    result.valid = !!(data.studentLevel && data.studentLevel !== '' && data.lessonThemes.length > 0);
    result.score = !data.studentLevel && data.lessonThemes.length === 0 ? 0
      : data.studentLevel && data.lessonThemes.length > 0 ? 2 : 1;
    return result;
  }

  validateTestReport(
    lessonPlanning: LessonPlanning,
    riskManagement: RiskManagement,
    teachingLearningStrategies: TeachingLearningStrategies,
  ): number {
    return (
      this.countCompletedQuestions(lessonPlanning)
      + this.countCompletedQuestions(riskManagement)
      + this.countCompletedQuestions(teachingLearningStrategies));
  }

  countCompletedQuestions(data: LessonPlanning | RiskManagement | TeachingLearningStrategies): number {
    return Object.keys(data).filter((key) => {
      if (key.indexOf('score') > -1) {
        return false;
      }
      return data[key].score !== null;
    }).length;
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
      },
    });

    await modal.present();
    const { data } = await modal.onDidDismiss<ModalEvent>();
    await this.onModalDismiss(data);
  };

  onModalDismiss = async (event: ModalEvent): Promise<void> => {
    switch (event) {
      case ModalEvent.CONTINUE:
        this.store$.dispatch(CalculateTestResult());
        await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE]);
        break;
      case ModalEvent.TERMINATE:
        this.store$.dispatch(TerminateTestFromTestReport());
        await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE]);
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
}
