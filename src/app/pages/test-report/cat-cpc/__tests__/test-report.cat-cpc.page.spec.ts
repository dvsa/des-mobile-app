import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Config, IonicModule, ModalController, NavParams, Platform,
} from '@ionic/angular';
import {
  ConfigMock, ModalControllerMock, NavParamsMock, PlatformMock,
} from 'ionic-mocks';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { ScreenOrientationMock } from '@shared/mocks/screen-orientation.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { CompetencyComponent } from '@pages/test-report/components/competency/competency';
import { ModuleAssessmentComponent } from '@pages/test-report/cat-cpc/components/module-assessment/module-assessment';
import { QuestionCardComponent } from '@pages/test-report/cat-cpc/components/question-card/question-card';
import { QuestionFooterComponent } from '@pages/test-report/cat-cpc/components/question-footer/question-footer';
import {
  QuestionDelExRadioCardComponent,
} from '@pages/test-report/cat-cpc/components/question-del-ex-radio-card/question-del-ex-radio-card';
import { QuestionTitleComponent } from '@pages/test-report/cat-cpc/components/question-title/question-title';
import { catCPCTestData, mockToggleEvent } from '@pages/test-report/cat-cpc/__mocks__/test-report.cat-cpc.mock';
import { StoreModel } from '@shared/models/store.model';
import { CPCQuestionProvider } from '@providers/cpc-questions/cpc-questions';
import { AnswerToggled, PopulateQuestionScore } from '@store/tests/test-data/cat-cpc/questions/questions.action';
import { PopulateTestScore } from '@store/tests/test-data/cat-cpc/overall-score/total-percentage.action';
import { QuestionNumber } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import { lgvQuestion5, lgvQuestions } from '@shared/constants/cpc-questions/cpc-lgv-questions.constants';
import { ActivityCodes } from '@shared/models/activity-codes';
import { CPCEndTestModal } from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal';
import { TestResultProviderMock } from '@providers/test-result/__mocks__/test-result.mock';
import { TestResultProvider } from '@providers/test-result/test-result';
import { ModalEvent } from '@pages/dashboard/components/practice-test-modal/practice-test-modal.constants';
import { OverlayEventDetail } from '@ionic/core';
import { QuestionScoreComponent } from '../components/question-score/question-score';
import { QuestionSubtitleComponent } from '../components/question-subtitle/question-subtitle';
import { QuestionFiveCardComponent } from '../components/question-five-card/question-five-card';
import { QuestionAnswerComponent } from '../components/question-answer/question-answer';
import { TestReportCatCPCPage } from '../test-report.cat-cpc.page';
import { testReportReducer } from '../../test-report.reducer';

describe('TestReportCatCPCPage', () => {
  let fixture: ComponentFixture<TestReportCatCPCPage>;
  let component: TestReportCatCPCPage;
  let store$: Store<StoreModel>;
  let cpcQuestionProvider: CPCQuestionProvider;
  let modalController: ModalController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportCatCPCPage,
        MockComponent(PracticeModeBanner),
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
              testData: initialState,
              journalData: {
                candidate: candidateMock,
              },
            },
          },
        })),
        StoreModule.forFeature('testReport', testReportReducer),
      ],
      providers: [
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        { provide: TestReportValidatorProvider, useClass: TestReportValidatorProviderMock },
        { provide: ScreenOrientation, useClass: ScreenOrientationMock },
        { provide: Insomnia, useClass: InsomniaMock },
        { provide: TestResultProvider, useClass: TestResultProviderMock },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReportCatCPCPage);
    component = fixture.componentInstance;

    store$ = TestBed.inject(Store);
    cpcQuestionProvider = TestBed.inject(CPCQuestionProvider);
    modalController = TestBed.inject(ModalController);
    spyOn(store$, 'dispatch');
  });

  describe('DOM', () => {
    describe('Fault Modes Styling', () => {
      it('should not have any fault mode styles applied when serious and dangerous mode is disabled', () => {
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
      });
      it('should have serious fault mode styles applied when serious mode is enabled', () => {
        component.isSeriousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeDefined();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
      });
      it('should have dangerous fault mode styles applied when dangerous mode is enabled', () => {
        component.isDangerousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeDefined();
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
  describe('setUpSubscription', () => {
    it('should subscribe to all observables and update class properties', () => {
      component.ngOnInit();
      component.pageState.question1$ = of(lgvQuestions[0]);
      component.pageState.question2$ = of(lgvQuestions[1]);
      component.pageState.question3$ = of(lgvQuestions[2]);
      component.pageState.question4$ = of(lgvQuestions[3]);
      component.pageState.question5$ = of(lgvQuestion5[0]);
      component.pageState.overallPercentage$ = of(10);
      component.pageState.category$ = of(TestCategory.CCPC);
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
  describe('onEndTestClick', () => {
    it('should create the end test modal with necessary params', async () => {
      spyOn(modalController, 'create').and.returnValue(Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => ({ data: ModalEvent.CANCEL }) as OverlayEventDetail,
      } as HTMLIonModalElement));
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
});
