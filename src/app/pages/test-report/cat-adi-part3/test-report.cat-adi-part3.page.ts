import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  LessonPlanning,
  LessonTheme,
  RiskManagement,
  StudentLevel,
  TeachingLearningStrategies,
  TestData,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { getLessonAndTheme } from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.reducer';
import {
  getLessonThemes,
  getOther,
  getStudentLevel,
} from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.selector';
import {
  LessonThemeAdded,
  LessonThemeChanged,
  LessonThemeRemoved,
  OtherChanged,
  StudentLevelChanged,
} from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.actions';
import { getLessonPlanning } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.reducer';
import { getRiskManagement } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.reducer';
import {
  getTeachingLearningStrategies,
} from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.reducer';
import {
  LessonPlanningQuestionScoreChanged,
} from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.actions';
import {
  RiskManagementQuestionScoreChanged,
} from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.actions';
import {
  TeachingLearningStrategiesQuestionScoreChanged,
} from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.actions';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { map } from 'rxjs/operators';
import { AssessmentOverallScoreChanged } from '@pages/test-report/cat-adi-part3/test-report.cat-adi-part3.actions';

interface CatADI3TestReportPageState {
  studentLevel$: Observable<StudentLevel>;
  lessonThemes$: Observable<LessonTheme[]>;
  otherReason$: Observable<string>;
  lessonPlanning$: Observable<LessonPlanning>;
  riskManagement$: Observable<RiskManagement>;
  teachingLearningStrategies$: Observable<TeachingLearningStrategies>;
  adi3TestData$: Observable<TestData>;
  totalScore$: Observable<number>;
}

type TestReportPageState = CommonTestReportPageState & CatADI3TestReportPageState;

@Component({
  selector: 'app-test-report-cat-adi3',
  templateUrl: './test-report.cat-adi-part3.page.html',
  styleUrls: ['./test-report.cat-adi-part3.page.scss'],
})
export class TestReportCatADI3Page extends TestReportBasePageComponent implements OnInit {

  form: UntypedFormGroup;
  pageState: TestReportPageState;
  page: 'lessonTheme' | 'testReport' = null;
  showMissing: boolean = false;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    modalController: ModalController,
    testReportValidatorProvider: TestReportValidatorProvider,
    routeByCategory: RouteByCategoryProvider,
    public navController: NavController,
    public adi3AssessmentProvider: ADI3AssessmentProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      modalController,
      testReportValidatorProvider,
      routeByCategory,
    );
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    this.page = this.router.getCurrentNavigation()?.extras?.state?.page;
    this.showMissing = this.router.getCurrentNavigation()?.extras?.state?.showMissing;

    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      ...this.commonPageState,
      studentLevel$: currentTest$.pipe(
        select(getTestData),
        select(getLessonAndTheme),
        select(getStudentLevel),
      ),
      lessonThemes$: currentTest$.pipe(
        select(getTestData),
        select(getLessonAndTheme),
        select(getLessonThemes),
      ),
      otherReason$: currentTest$.pipe(
        select(getTestData),
        select(getLessonAndTheme),
        select(getOther),
      ),
      lessonPlanning$: currentTest$.pipe(
        select(getTestData),
        select(getLessonPlanning),
      ),
      riskManagement$: currentTest$.pipe(
        select(getTestData),
        select(getRiskManagement),
      ),
      teachingLearningStrategies$: currentTest$.pipe(
        select(getTestData),
        select(getTeachingLearningStrategies),
      ),
      adi3TestData$: currentTest$.pipe(
        select(getTestData),
      ),
      totalScore$: currentTest$.pipe(
        select(getTestData),
        map(this.adi3AssessmentProvider.getTotalAssessmentScore),
      ),
    };
    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();
  }

  studentLevelChanged = (studentLeveL: StudentLevel): void => {
    this.store$.dispatch(StudentLevelChanged(studentLeveL));
  };

  lessonThemeChanged = ({
                          lessonTheme,
                          added,
                        }: { lessonTheme: LessonTheme, added: boolean }): void => {
    this.store$.dispatch(LessonThemeChanged(lessonTheme as LessonTheme));
    if (added) {
      this.store$.dispatch(LessonThemeAdded(lessonTheme));
    } else {
      this.store$.dispatch(LessonThemeRemoved(lessonTheme));
    }
  };

  otherReasonChanged = (otherReason: string): void => {
    this.store$.dispatch(OtherChanged(otherReason));
  };

  lessonPlanningChanged = ({
                             question,
                             answer,
                           }: { question: number; answer: number; }): void => {
    this.store$.dispatch(LessonPlanningQuestionScoreChanged(question, answer));
  };

  riskManagementChanged = ({
                             question,
                             answer,
                           }: { question: number; answer: number; }): void => {
    this.store$.dispatch(RiskManagementQuestionScoreChanged(question, answer));
  };

  teachingLearningStrategyChanged = ({
                                       question,
                                       answer,
                                     }: { question: number; answer: number; }): void => {
    this.store$.dispatch(TeachingLearningStrategiesQuestionScoreChanged(question, answer));
  };

  onContinueClick = (totalScore: number): void => {
    Object.keys(this.form.controls)
      .forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.invalid) {
      return;
    }
    this.store$.dispatch(AssessmentOverallScoreChanged(totalScore));
    this.navController.back();
  };
}
