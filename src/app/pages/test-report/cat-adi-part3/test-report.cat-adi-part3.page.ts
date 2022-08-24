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
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  LessonPlanning, LessonTheme, RiskManagement, StudentLevel, TeachingLearningStrategies,
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
  LessonThemeChanged,
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

interface CatADI3TestReportPageState {
  studentLevel$: Observable<StudentLevel>;
  lessonThemes$: Observable<LessonTheme[]>;
  otherReason$: Observable<string>;
  lessonPlanning$: Observable<LessonPlanning>;
  riskManagement$: Observable<RiskManagement>;
  teachingLearningStrategies$: Observable<TeachingLearningStrategies>;
}

type TestReportPageState = CommonTestReportPageState & CatADI3TestReportPageState;

@Component({
  selector: 'app-test-report-cat-adi3',
  templateUrl: './test-report.cat-adi-part3.page.html',
  styleUrls: ['./test-report.cat-adi-part3.page.scss'],
})
export class TestReportCatADI3Page extends TestReportBasePageComponent implements OnInit {

  form: FormGroup;
  pageState: TestReportPageState;
  page: 'lessonTheme' | 'testReport' = null;

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
    private navController: NavController,
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

  ngOnInit(): void {
    this.page = this.router.getCurrentNavigation()?.extras?.state?.page;

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

  lessonThemeChanged = (lessonTheme: string): void => {
    this.store$.dispatch(LessonThemeChanged(lessonTheme as LessonTheme));
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

  onContinueClick = (): void => {
    Object.keys(this.form.controls)
      .forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.invalid) {
      return;
    }
    this.navController.back();
  };

  getTotalScore() {
    let total = 0;
    this.pageState.lessonPlanning$.subscribe((value) => {
      total += value.score;
    });
    this.pageState.riskManagement$.subscribe((value) => {
      total += value.score;
    });
    this.pageState.teachingLearningStrategies$.subscribe((value) => {
      total += value.score;
    });

    return total;
  }
}
