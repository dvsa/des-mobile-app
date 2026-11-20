import { NgClass } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { FormsModule, UntypedFormGroup } from '@angular/forms';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { Question, Question5, TestData } from '@dvsa/mes-test-schema/categories/CPC';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular';
import { CPCEndTestModal } from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal';
import { CPCQuestionProvider } from '@providers/cpc-questions/cpc-questions';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { QuestionNumber } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import { PopulateTestScore } from '@store/tests/test-data/cat-cpc/overall-score/total-percentage.action';
import { AnswerToggled, PopulateQuestionScore } from '@store/tests/test-data/cat-cpc/questions/questions.action';
import { lastValueFrom } from 'rxjs';
import { ModuleAssessmentComponent } from './components/module-assessment/module-assessment';
import { QuestionCardComponent } from './components/question-card/question-card';
import { QuestionDelExRadioCardComponent } from './components/question-del-ex-radio-card/question-del-ex-radio-card';
import { QuestionFiveCardComponent } from './components/question-five-card/question-five-card';
import { QuestionFooterComponent } from './components/question-footer/question-footer';

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
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    ModuleAssessmentComponent,
    QuestionCardComponent,
    QuestionFiveCardComponent,
    QuestionDelExRadioCardComponent,
    FormsModule,
    QuestionFooterComponent,
  ],
})
export class TestReportCatCPCPage extends TestReportBasePageComponent implements OnInit {
  pageNumber = 1;
  form: UntypedFormGroup;
  category: CategoryCode;
  isDelegated: boolean;

  question1 = computed(() => (this.testData() as TestData).question1);
  question2 = computed(() => (this.testData() as TestData).question2);
  question3 = computed(() => (this.testData() as TestData).question3);
  question4 = computed(() => (this.testData() as TestData).question4);
  question5 = computed(() => (this.testData() as TestData).question5);
  overallPercentage = computed(() => (this.testData() as TestData).totalPercent);
  combinationCode = computed(() => (this.testData() as TestData).combination);

  questions = computed(() => [
    this.question1(),
    this.question2(),
    this.question3(),
    this.question4(),
    this.question5(),
  ]);

  constructor(
    private cpcQuestionProvider: CPCQuestionProvider,
    private testResultProvider: TestResultProvider
  ) {
    super();
    this.form = new UntypedFormGroup({});
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  onEndTestClick = async (): Promise<void> => {
    const result = await lastValueFrom(this.testResultProvider.calculateTestResult(this.category, this.testData()));

    const modal: HTMLIonModalElement = await this.modalController.create({
      component: CPCEndTestModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: {
        cpcQuestions: this.questions(),
        totalPercentage: this.overallPercentage(),
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
    const { questionNumber, answerNumber, answer } = event;
    const { selected } = answer;

    // Update question answered selected value
    const questionNum: QuestionNumber = this.translateToQuestionNumberInterface(questionNumber);
    this.store$.dispatch(AnswerToggled(selected, questionNum, answerNumber));

    // Update question score
    const question: Question | Question5 = this.testData()[`question${questionNumber}`];
    const questionScore: number = this.cpcQuestionProvider.getQuestionScore(question, questionNum);
    this.store$.dispatch(PopulateQuestionScore(questionNum, questionScore));

    // Update total score
    const totalScore: number = this.cpcQuestionProvider.getTotalQuestionScore(this.testData() as TestData);
    this.store$.dispatch(PopulateTestScore(totalScore));
  };

  populateScore = (event: ToggleEvent): void => {
    // Update question answered selected value
    const questionNum: QuestionNumber = this.translateToQuestionNumberInterface(event.questionNumber);

    // Update question score
    this.store$.dispatch(PopulateQuestionScore(questionNum, Number(event.score)));

    // Update total score
    const totalScore: number = this.cpcQuestionProvider.getTotalQuestionScore(this.testData() as TestData);
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
}
