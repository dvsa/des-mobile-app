import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
  trDestroy$,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { combineLatest, Observable, Subscription } from 'rxjs';
import {
  CombinationCodes, Question, Question5, TestData,
} from '@dvsa/mes-test-schema/categories/CPC';
import { getTestData } from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import {
  getCombination,
  getQuestion1,
  getQuestion2,
  getQuestion3,
  getQuestion4,
  getQuestion5,
  getTotalPercent,
} from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.selector';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { QuestionNumber } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import { AnswerToggled, PopulateQuestionScore } from '@store/tests/test-data/cat-cpc/questions/questions.action';
import { PopulateTestScore } from '@store/tests/test-data/cat-cpc/overall-score/total-percentage.action';
import { CPCQuestionProvider } from '@providers/cpc-questions/cpc-questions';
import { UntypedFormGroup } from '@angular/forms';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { CPCEndTestModal } from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal';
import { TestResultProvider } from '@providers/test-result/test-result';
import { takeUntil } from 'rxjs/operators';

interface CatCPCTestReportPageState {
  combinationCode$: Observable<CombinationCodes>;
  question1$: Observable<Question>;
  question2$: Observable<Question>;
  question3$: Observable<Question>;
  question4$: Observable<Question>;
  question5$: Observable<Question5>;
  overallPercentage$: Observable<number>;
  delegatedTest$: Observable<boolean>;
  testDataCPC$: Observable<TestData>;
}

type TestReportPageState = CommonTestReportPageState & CatCPCTestReportPageState;

type ToggleEvent = {
  answer: {
    label: string;
    selected: boolean;
  };
  questionNumber: number;
  answerNumber: string;
  score: number;
};

@Component({
  selector: 'app-test-report-cat-cpc',
  templateUrl: './test-report.cat-cpc.page.html',
  styleUrls: ['./test-report.cat-cpc.page.scss'],
})
export class TestReportCatCPCPage extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;
  pageNumber: number = 1;
  form: UntypedFormGroup;
  questions: (Question | Question5) [];
  overallPercentage: number;
  category: CategoryCode;
  isDelegated: boolean;
  testData: TestData;
  localSubscription: Subscription;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    modalController: ModalController,
    testReportValidatorProvider: TestReportValidatorProvider,
    insomnia: Insomnia,
    routeByCategory: RouteByCategoryProvider,
    private cpcQuestionProvider: CPCQuestionProvider,
    private testResultProvider: TestResultProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      modalController,
      testReportValidatorProvider,
      insomnia,
      routeByCategory,
    );
    this.form = new UntypedFormGroup({});
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.localSubscription = currentTest$.pipe(
      select(getTestData),
    )
      .subscribe((result: TestData) => this.testData = result);

    this.pageState = {
      ...this.commonPageState,
      combinationCode$: currentTest$.pipe(
        select(getTestData),
        select(getCombination),
      ),
      question1$: currentTest$.pipe(
        select(getTestData),
        select(getQuestion1),
      ),
      question2$: currentTest$.pipe(
        select(getTestData),
        select(getQuestion2),
      ),
      question3$: currentTest$.pipe(
        select(getTestData),
        select(getQuestion3),
      ),
      question4$: currentTest$.pipe(
        select(getTestData),
        select(getQuestion4),
      ),
      question5$: currentTest$.pipe(
        select(getTestData),
        select(getQuestion5),
      ),
      overallPercentage$: currentTest$.pipe(
        select(getTestData),
        select(getTotalPercent),
      ),
      delegatedTest$: currentTest$.pipe(
        select(getDelegatedTestIndicator),
        select(isDelegatedTest),
      ),
      testDataCPC$: currentTest$.pipe(
        select(getTestData),
      ),
    };
    this.setupSubscription();
  }

  async ionViewWillEnter() {
    this.ngOnInit();
    await super.ionViewWillEnter();
    this.setUpSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();

    if (this.localSubscription) {
      this.localSubscription.unsubscribe();
    }
  }

  onEndTestClick = async (): Promise<void> => {
    const result = await this.testResultProvider.calculateTestResult(this.category, this.testData)
      .toPromise();

    const modal: HTMLIonModalElement = await this.modalController.create({
      component: CPCEndTestModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: {
        cpcQuestions: this.questions,
        totalPercentage: this.overallPercentage,
        testResult: result,
      },
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    await this.onModalDismiss(data);
  };

  questionPageChanged = (pageNumber: number): void => {
    this.pageNumber = pageNumber;
  };

  populateAnswer = (event: ToggleEvent): void => {
    const {
      questionNumber,
      answerNumber,
      answer,
    } = event;
    const { selected } = answer;

    // Update question answered selected value
    const questionNum: QuestionNumber = this.translateToQuestionNumberInterface(questionNumber);
    this.store$.dispatch(AnswerToggled(selected, questionNum, answerNumber));

    // Update question score
    const question: Question | Question5 = this.testData[`question${questionNumber}`];
    const questionScore: number = this.cpcQuestionProvider.getQuestionScore(question, questionNum);
    this.store$.dispatch(PopulateQuestionScore(questionNum, questionScore));

    // Update total score
    const totalScore: number = this.cpcQuestionProvider.getTotalQuestionScore(this.testData);
    this.store$.dispatch(PopulateTestScore(totalScore));
  };

  populateScore = (event: ToggleEvent): void => {
    // Update question answered selected value
    const questionNum: QuestionNumber = this.translateToQuestionNumberInterface(event.questionNumber);

    // Update question score
    this.store$.dispatch(PopulateQuestionScore(questionNum, Number(event.score)));

    // Update total score
    const totalScore: number = this.cpcQuestionProvider.getTotalQuestionScore(this.testData);
    this.store$.dispatch(PopulateTestScore(totalScore));
  };

  translateToQuestionNumberInterface = (questionNumber: number): QuestionNumber => {
    return new Map<number, QuestionNumber>([
      [1, QuestionNumber.ONE],
      [2, QuestionNumber.TWO],
      [3, QuestionNumber.THREE],
      [4, QuestionNumber.FOUR],
      [5, QuestionNumber.FIVE],
    ]).get(questionNumber);
  };

  setUpSubscription(): void {
    this.subscription = combineLatest([
      this.pageState.question1$,
      this.pageState.question2$,
      this.pageState.question3$,
      this.pageState.question4$,
      this.pageState.question5$,
      this.pageState.overallPercentage$,
      this.pageState.category$,
      this.pageState.delegatedTest$,
    ])
      .pipe(takeUntil(trDestroy$))
      .subscribe((
        [question1, question2, question3, question4, question5, overallPercentage, category, delegated]:
        [Question, Question, Question, Question, Question5, number, CategoryCode, boolean],
      ) => {
        this.questions = [question1, question2, question3, question4, question5];
        this.overallPercentage = overallPercentage;
        this.category = category;
        this.isDelegated = delegated;
      });
  }
}
