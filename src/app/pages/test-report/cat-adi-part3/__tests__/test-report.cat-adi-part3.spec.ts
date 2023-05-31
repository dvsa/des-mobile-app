import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  IonicModule, ModalController, NavController, NavParams, Platform,
} from '@ionic/angular';
import { ModalControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { MockComponent } from 'ng-mocks';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { Action, Store, StoreModule } from '@ngrx/store';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestReportCatADI3Page } from '@pages/test-report/cat-adi-part3/test-report.cat-adi-part3.page';
import {
  LessonPlanning,
  RiskManagement,
  TeachingLearningStrategies, TestData,
  TestResultCatADI3Schema,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StudentComponent } from '@pages/test-report/cat-adi-part3/components/student/student';
import { LessonThemeComponent } from '@pages/test-report/cat-adi-part3/components/lesson-theme/lesson-theme';
import {
  TestReportAssessmentCard,
} from '@pages/test-report/cat-adi-part3/components/tr-assessment-card/tr-assessment-card';
import { StoreModel } from '@shared/models/store.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  LessonThemeAdded,
  LessonThemeChanged,
  LessonThemeRemoved,
  OtherChanged,
  StudentLevelChanged,
} from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.actions';
import {
  LessonPlanningQuestionScoreChanged,
} from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.actions';
import {
  RiskManagementQuestionScoreChanged,
} from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.actions';
import {
  TeachingLearningStrategiesQuestionScoreChanged,
} from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.actions';
import { NavControllerMock } from '@shared/mocks/nav-controller.mock';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { of } from 'rxjs';
import { testReportReducer } from '../../test-report.reducer';

describe('TestReportCatADI3Page', () => {
  let fixture: ComponentFixture<TestReportCatADI3Page>;
  let component: TestReportCatADI3Page;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportCatADI3Page,
        MockComponent(PracticeModeBanner),
        MockComponent(StudentComponent),
        MockComponent(LessonThemeComponent),
        MockComponent(TestReportAssessmentCard),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forFeature('tests', () => (
          {
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
                category: TestCategory.ADI3,
              } as TestResultCatADI3Schema,
            },
          })),
        StoreModule.forFeature('testReport', testReportReducer),
      ],
      providers: [
        {
          provide: NavParams,
          useClass: NavParamsMock,
        },
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
          provide: Insomnia,
          useClass: InsomniaMock,
        },
        {
          provide: NavController,
          useClass: NavControllerMock,
        },
        provideMockStore({
          initialState: {
            appInfo: { versionNumber: '4.0' } as AppInfoStateModel,
          },
        }),
      ],
    });

    fixture = TestBed.createComponent(TestReportCatADI3Page);
    component = fixture.componentInstance;
    store$ = TestBed.inject(MockStore);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    describe('studentLevelChanged', () => {
      it('should dispatch the StudentLevelChanged action', () => {
        component.studentLevelChanged('beginner');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(StudentLevelChanged('beginner'));
      });
    });
    describe('lessonThemeChanged', () => {
      it('should dispatch the LessonThemeChanged & lessonThemeAdded actions', () => {
        component.lessonThemeChanged({
          lessonTheme: 'junctions',
          added: true,
        });
        expect(store$.dispatch)
          .toHaveBeenCalledWith(LessonThemeChanged('junctions'));
        expect(store$.dispatch)
          .toHaveBeenCalledWith(LessonThemeAdded('junctions'));
      });
      it('should dispatch the LessonThemeChanged & lessonThemeRemoved actions', () => {
        component.lessonThemeChanged({
          lessonTheme: 'junctions',
          added: false,
        });
        expect(store$.dispatch)
          .toHaveBeenCalledWith(LessonThemeChanged('junctions'));
        expect(store$.dispatch)
          .toHaveBeenCalledWith(LessonThemeRemoved('junctions'));
      });
    });
    describe('otherReasonChanged', () => {
      it('should dispatch the OtherChanged action', () => {
        component.otherReasonChanged('some reason');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(OtherChanged('some reason'));
      });
    });
    describe('lessonPlanningChanged', () => {
      it('should dispatch the LessonPlanningQuestionScoreChanged action', () => {
        component.lessonPlanningChanged({
          question: 1,
          answer: 2,
        });
        expect(store$.dispatch)
          .toHaveBeenCalledWith(LessonPlanningQuestionScoreChanged(1, 2));
      });
    });
    describe('riskManagementChanged', () => {
      it('should dispatch the RiskManagementQuestionScoreChanged action', () => {
        component.riskManagementChanged({
          question: 1,
          answer: 2,
        });
        expect(store$.dispatch)
          .toHaveBeenCalledWith(RiskManagementQuestionScoreChanged(1, 2));
      });
    });
    describe('ionViewDidLeave', () => {
      it('should run basePageComponent functions', () => {
        spyOn(TestReportBasePageComponent.prototype, 'ionViewDidLeave');
        spyOn(TestReportBasePageComponent.prototype, 'cancelSubscription');
        component.ionViewDidLeave();

        expect(TestReportBasePageComponent.prototype.ionViewDidLeave).toHaveBeenCalled();
        expect(TestReportBasePageComponent.prototype.cancelSubscription).toHaveBeenCalled();
      });
    });
    describe('teachingLearningStrategyChanged', () => {
      it('should dispatch the TeachingLearningStrategiesQuestionScoreChanged action', () => {
        component.teachingLearningStrategyChanged({
          question: 1,
          answer: 2,
        });
        expect(store$.dispatch)
          .toHaveBeenCalledWith(TeachingLearningStrategiesQuestionScoreChanged(1, 2));
      });
    });
    fdescribe('onContinueClick', () => {
      it('should dispatch AssessmentOverallScoreChanged action with the total score value', () => {
        const adi3TestData: TestData = {
          lessonPlanning: {
            score: 5,
          } as LessonPlanning,
          riskManagement: {
            score: 5,
          } as RiskManagement,
          teachingLearningStrategies: {
            score: 5,
          } as TeachingLearningStrategies,
        };

        component.pageState = {
          adi3TestData$: of(adi3TestData),
        } as any;

        component.onContinueClick();

        expect(store$.dispatch).toHaveBeenCalledWith(
          { score: 15, type: '[TestReportPage] Assessment Overall Score Changed' } as Action,
        );
        expect(component.navController.back).toHaveBeenCalled();
      });
    });
  });

});
