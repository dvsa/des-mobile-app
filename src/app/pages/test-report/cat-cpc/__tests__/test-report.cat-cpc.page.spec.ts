import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideBasePageMocks } from '@mocks/test-providers';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { OverlayEventDetail } from '@ionic/core';
import { ModalEvent } from '@pages/dashboard/components/practice-test-modal/practice-test-modal.constants';
import { mockToggleEvent } from '@pages/test-report/cat-cpc/__mocks__/test-report.cat-cpc.mock';
import { CPCEndTestModal } from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal';
import { ModuleAssessmentComponent } from '@pages/test-report/cat-cpc/components/module-assessment/module-assessment';
import { QuestionCardComponent } from '@pages/test-report/cat-cpc/components/question-card/question-card';
import { QuestionDelExRadioCardComponent } from '@pages/test-report/cat-cpc/components/question-del-ex-radio-card/question-del-ex-radio-card';
import { QuestionFooterComponent } from '@pages/test-report/cat-cpc/components/question-footer/question-footer';
import { QuestionTitleComponent } from '@pages/test-report/cat-cpc/components/question-title/question-title';
import { CompetencyComponent } from '@pages/test-report/components/competency/competency';

import { CPCQuestionProvider } from '@providers/cpc-questions/cpc-questions';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProviderMock } from '@providers/test-result/__mocks__/test-result.mock';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { lgvQuestions } from '@shared/constants/cpc-questions/cpc-lgv-questions.constants';
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
      imports: [
        StoreModule.forRoot({}),

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
      providers: [
        provideBasePageMocks(),
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
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
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('ionViewWillEnter', () => {
    it('should call the correct functions', async () => {
      vi.spyOn(TestReportBasePageComponent.prototype, 'ionViewWillEnter').mockReturnValue(undefined);
      await component.ionViewWillEnter();
      expect(TestReportBasePageComponent.prototype.ionViewWillEnter).toHaveBeenCalled();
    });
  });

  describe('onEndTestClick', () => {
    it('should create the end test modal with necessary params', async () => {
      vi.spyOn(modalController, 'create').mockReturnValue(
        Promise.resolve({
          present: () => Promise.resolve(),
          onDidDismiss: () => ({ data: ModalEvent.CANCEL }) as OverlayEventDetail,
        } as HTMLIonModalElement)
      );
      component.questions = signal([lgvQuestions[0]]);
      component.overallPercentage = signal(90);
      await component.onEndTestClick();
      expect(modalController.create).toHaveBeenCalledWith({
        component: CPCEndTestModal,
        cssClass: 'mes-modal-alert text-zoom-regular',
        componentProps: {
          cpcQuestions: component.questions(),
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
      vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
      vi.spyOn(cpcQuestionProvider, 'getQuestionScore').mockReturnValue(5);
      vi.spyOn(cpcQuestionProvider, 'getTotalQuestionScore').mockReturnValue(40);

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
        vi.spyOn(component, 'translateToQuestionNumberInterface').mockReturnValue(QuestionNumber.ONE);
        vi.spyOn(cpcQuestionProvider, 'getTotalQuestionScore').mockReturnValue(1);
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
});
