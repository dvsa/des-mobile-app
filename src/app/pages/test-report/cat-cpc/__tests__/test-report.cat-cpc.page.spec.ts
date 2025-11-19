import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { Subscription, of } from 'rxjs';

import { AppModule } from '@app/app.module';
import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { OverlayEventDetail } from '@ionic/core';
import { ModalEvent } from '@pages/dashboard/components/practice-test-modal/practice-test-modal.constants';
import { catCPCTestData, mockToggleEvent } from '@pages/test-report/cat-cpc/__mocks__/test-report.cat-cpc.mock';
import { CPCEndTestModal } from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal';
import { ModuleAssessmentComponent } from '@pages/test-report/cat-cpc/components/module-assessment/module-assessment';
import { QuestionCardComponent } from '@pages/test-report/cat-cpc/components/question-card/question-card';
import { QuestionDelExRadioCardComponent } from '@pages/test-report/cat-cpc/components/question-del-ex-radio-card/question-del-ex-radio-card';
import { QuestionFooterComponent } from '@pages/test-report/cat-cpc/components/question-footer/question-footer';
import { QuestionTitleComponent } from '@pages/test-report/cat-cpc/components/question-title/question-title';
import { CompetencyComponent } from '@pages/test-report/components/competency/competency';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { CPCQuestionProvider } from '@providers/cpc-questions/cpc-questions';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProviderMock } from '@providers/test-result/__mocks__/test-result.mock';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { lgvQuestion5, lgvQuestions } from '@shared/constants/cpc-questions/cpc-lgv-questions.constants';
import { QuestionNumber } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { PopulateTestScore } from '@store/tests/test-data/cat-cpc/overall-score/total-percentage.action';
import { AnswerToggled, PopulateQuestionScore } from '@store/tests/test-data/cat-cpc/questions/questions.action';
import { testReportReducer } from '../../test-report.reducer';
import { QuestionAnswerComponent } from '../components/question-answer/question-answer';
import { QuestionFiveCardComponent } from '../components/question-five-card/question-five-card';
import { QuestionScoreComponent } from '../components/question-score/question-score';
import { QuestionSubtitleComponent } from '../components/question-subtitle/question-subtitle';
import { TestReportCatCPCPage } from '../test-report.cat-cpc.page';

describe('TestReportCatCPCPage', () => {
  let fixture: ComponentFixture<TestReportCatCPCPage>;
  let component: TestReportCatCPCPage;
  let store$: Store<StoreModel>;
  let cpcQuestionProvider: CPCQuestionProvider;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportCatCPCPage,
        MockComponent(PracticeModeOptionsBar),
        MockComponent(CompetencyComponent),
        MockComponent(ModuleAssessmentComponent),
        MockComponent(QuestionAnswerComponent),
        MockComponent(QuestionCardComponent),
        MockComponent(QuestionFiveCardComponent),
        MockComponent(QuestionFooterComponent),
        MockComponent(QuestionScoreComponent),
        MockComponent(QuestionSubtitleComponent),
        MockComponent(QuestionTitleComponent),
        MockComponent(QuestionDelExRadioCardComponent),
        MockComponent(TestFlowHeaderComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forFeature('tests', () => ({
          currentTest: {
            slotId: '123',
          },
          testStatus: {},
          startedTests: {
            123: {
              testData: {
                question1: { score: 1 },
                question2: { score: 1 },
                question3: { score: 1 },
                question4: { score: 1 },
                question5: { score: 1 },
                ...initialState,
              },
              journalData: {
                candidate: candidateMock,
              },
            },
          },
        })),
        StoreModule.forFeature('testReport', testReportReducer),
      ],
      providers: [
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: TestReportValidatorProvider,
          useClass: TestReportValidatorProviderMock,
        },
        {
          provide: TestResultProvider,
          useClass: TestResultProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(TestReportCatCPCPage);
    component = fixture.componentInstance;

    store$ = TestBed.inject(Store);
    cpcQuestionProvider = TestBed.inject(CPCQuestionProvider);
    modalController = TestBed.inject(ModalController);
    spyOn(store$, 'dispatch');
  });

  describe('ionViewWillEnter', () => {
    it('should call the correct functions', async () => {
      spyOn(TestReportBasePageComponent.prototype, 'ionViewWillEnter');
      spyOn(component, 'setUpSubscription');
      await component.ionViewWillEnter();
      expect(TestReportBasePageComponent.prototype.ionViewWillEnter).toHaveBeenCalled();
      expect(component.setUpSubscription).toHaveBeenCalled();
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from the localSubscription if there is one', () => {
      spyOn(TestReportBasePageComponent.prototype, 'ionViewDidLeave');
      spyOn(TestReportBasePageComponent.prototype, 'cancelSubscription');

      component.localSubscription = new Subscription();
      spyOn(component.localSubscription, 'unsubscribe');

      component.ionViewDidLeave();

      expect(component.localSubscription.unsubscribe).toHaveBeenCalled();
      expect(TestReportBasePageComponent.prototype.ionViewDidLeave).toHaveBeenCalled();
      expect(TestReportBasePageComponent.prototype.cancelSubscription).toHaveBeenCalled();
    });
  });

  describe('onEndTestClick', () => {
    it('should create the end test modal with necessary params', async () => {
      spyOn(modalController, 'create').and.returnValue(
        Promise.resolve({
          present: () => Promise.resolve(),
          onDidDismiss: () => ({ data: ModalEvent.CANCEL }) as OverlayEventDetail,
        } as HTMLIonModalElement)
      );
      component.questions = [lgvQuestions[0]];
      component.overallPercentage = 90;
      await component.onEndTestClick();
      expect(modalController.create).toHaveBeenCalledWith({
        component: CPCEndTestModal,
        cssClass: 'mes-modal-alert text-zoom-regular',
        componentProps: {
          cpcQuestions: component.questions,
          totalPercentage: 90,
          testResult: ActivityCodes.PASS,
        },
      });
    });
  });

  describe('questionPageChanged', () => {
    it('should set the value passed into the function to a variable', () => {
      expect(component.pageNumber).toEqual(1);
      component.questionPageChanged(2);
      expect(component.pageNumber).toEqual(2);
    });
  });

  describe('populateAnswer', () => {
    it('should dispatch actions populating the answer selected value & the question scores', () => {
      spyOn(store$, 'dispatch');
      spyOn(cpcQuestionProvider, 'getQuestionScore').and.returnValue(5);
      spyOn(cpcQuestionProvider, 'getTotalQuestionScore').and.returnValue(40);

      component.testData = catCPCTestData;
      component.populateAnswer(mockToggleEvent);

      expect(store$.dispatch).toHaveBeenCalledWith(AnswerToggled(true, QuestionNumber.ONE, '2'));
      expect(store$.dispatch).toHaveBeenCalledWith(PopulateQuestionScore(QuestionNumber.ONE, 5));
      expect(store$.dispatch).toHaveBeenCalledWith(PopulateTestScore(40));
    });
  });

  describe('populateScore', () => {
    it(
      'should set questionNum to the value of translateToQuestionNumberInterface, ' +
        'calculate the total score and dispatch both results',
      () => {
        spyOn(component, 'translateToQuestionNumberInterface').and.returnValue(QuestionNumber.ONE);
        spyOn(cpcQuestionProvider, 'getTotalQuestionScore').and.returnValue(1);
        component.populateScore({
          answer: {
            label: null,
            selected: null,
          },
          questionNumber: null,
          answerNumber: null,
          score: 3,
        });

        expect(component.store$.dispatch).toHaveBeenCalledWith(PopulateQuestionScore(QuestionNumber.ONE, 3));
        expect(component.store$.dispatch).toHaveBeenCalledWith(PopulateTestScore(1));
      }
    );
  });

  describe('setUpSubscription', () => {
    it('should subscribe to all observables and update class properties', () => {
      component.pageState = {
        combinationCode$: of(null),
        question1$: of(lgvQuestions[0]),
        question2$: of(lgvQuestions[1]),
        question3$: of(lgvQuestions[2]),
        question4$: of(lgvQuestions[3]),
        question5$: of(lgvQuestion5[0]),
        overallPercentage$: of(10),
        testDataCPC$: of(null),
        candidateUntitledName$: of(null),
        isRemoveFaultMode$: of(null),
        isSeriousMode$: of(null),
        isDangerousMode$: of(null),
        manoeuvres$: of(null),
        testData$: of(null),
        testRequirements$: of(null),
        category$: of(TestCategory.CCPC),
      };

      component.setUpSubscription();
      expect(component.questions).toEqual([
        lgvQuestions[0],
        lgvQuestions[1],
        lgvQuestions[2],
        lgvQuestions[3],
        lgvQuestion5[0],
      ]);
      expect(component.overallPercentage).toEqual(10);
      expect(component.category).toEqual(TestCategory.CCPC);
    });
  });
});
