import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebriefPage } from '@pages/debrief/debrief.page';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppModule } from '@app/app.module';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { FaultSummaryProviderMock } from '@providers/fault-summary/__mocks__/fault-summary.mock';
import { TranslateModule } from '@ngx-translate/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestOutcome as OutcomeType } from '@store/tests/tests.constants';
import { DebriefViewDidEnter } from '@pages/debrief/debrief.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Subscription } from 'rxjs';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { take } from 'rxjs/operators';
import { TestData, TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { TestsModel } from '@store/tests/tests.model';

export enum TestOutcome {
  PASS = 'Pass',
  FAIL = 'Fail',
}
describe('DebriefPage', () => {
  let fixture: ComponentFixture<DebriefPage>;
  let component: DebriefPage;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        DebriefPage,
      ],
      imports: [
        AppModule,
        TranslateModule,
        StoreModule.forFeature('testReport', testReportReducer),
        StoreModule.forFeature('tests', () => (
          {
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                category: TestCategory.B,
                journalData: {
                  candidate: {
                    candidateName: {
                      firstName: 'firstName',
                      lastName: 'lastName',
                    },
                  },
                },
                communicationPreferences: {
                  conductedLanguage: 'English',
                },
                testData: {
                  emergencyStop: {
                    firstAttempt: 1,
                    secondAttempt: 2,
                  },
                  avoidance: {
                    firstAttempt: 1,
                    secondAttempt: 2,
                  },
                  review: {
                    seekFurtherDevelopment: true,
                    reasonForNoAdviceGiven: 'test',
                    grade: 'test1',
                    immediateDanger: false,
                  },
                  teachingLearningStrategies: {
                    score: 1,
                  },
                  lessonAndTheme: {
                    lessonThemes: ['junctions'],
                  },
                  lessonPlanning: {
                    score: 1,
                  },
                  riskManagement: {
                    score: 1,
                  },
                  totalPercent: 100,
                  question1: {
                    score: 1,
                  },
                  question2: {
                    score: 1,
                  },
                  question3: {
                    score: 1,
                  },
                  question4: {
                    score: 1,
                  },
                  question5: {
                    score: 1,
                  },
                  ETA: {
                    physical: true,
                  },
                  eco: {
                    completed: true,
                  },
                  seriousFaults: {
                    controlsAccelerator: true,
                  },
                  dangerousFaults: {
                    positioningNormalDriving: true,
                  },
                  drivingFaults: {
                    controlsAccelerator: 1,
                    judgementOvertaking: 1,
                  },
                  safetyQuestions: {
                    questions: [
                      {
                        outcome: 'DF',
                        description: 'Fire Extinguisher',
                      },
                    ],
                    faultComments: '',
                  },
                  vehicleChecks: {
                    showMeQuestions: [{
                      code: 'test1',
                      description: 'string',
                      outcome: 'P',
                    }],
                    tellMeQuestions: [{
                      code: 'test2',
                      description: 'string',
                      outcome: 'P',
                    }],
                  },
                } as TestData,
              } as TestResultCommonSchema,
            },
          } as TestsModel
        )),
      ],
      providers: [
        { provide: FaultSummaryProvider, useClass: FaultSummaryProviderMock },
      ],
    });

    fixture = TestBed.createComponent(DebriefPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xdescribe('ngOnInit', () => {
    it('should resolve state variables', () => {

      component.ngOnInit();
      component.pageState.seriousFaults$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual([]));
      component.pageState.dangerousFaults$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual([]));
      component.pageState.drivingFaults$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual([]));
      component.pageState.drivingFaultCount$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(1));
      component.pageState.etaFaults$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({ physical: true }));
      component.pageState.ecoFaults$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({ completed: true }));
      component.pageState.testResult$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual('Terminated'));
      component.pageState.conductedLanguage$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual('English'));
      component.pageState.candidateName$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual('firstName lastName'));
      component.pageState.category$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(TestCategory.B));
      component.pageState.tellMeShowMeQuestions$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual([
            {
              code: 'test2',
              description: 'string',
              outcome: 'P',
            },
            {
              code: 'test1',
              description: 'string',
              outcome: 'P',
            },
          ]));
      component.pageState.question1$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({ score: 1 }));
      component.pageState.question2$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({ score: 1 }));
      component.pageState.question3$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({ score: 1 }));
      component.pageState.question4$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({ score: 1 }));
      component.pageState.question5$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({ score: 1 }));
      component.pageState.overallScore$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(100));
      component.pageState.totalScore$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(3));
      component.pageState.lessonTheme$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({
            lessonThemes: ['junctions'],
          }));
      component.pageState.lessonPlanning$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({
            score: 1,
          }));
      component.pageState.riskManagement$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({
            score: 1,
          }));
      component.pageState.teachingLearningStrategies$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({
            score: 1,
          }));
      component.pageState.review$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({
            seekFurtherDevelopment: true,
            reasonForNoAdviceGiven: 'test',
            grade: 'test1',
            immediateDanger: false,
          }));
      component.pageState.showEco$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(true));
      component.pageState.showSpeedCheck$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(false));
      component.pageState.showSafetyQuestions$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(false));
      component.pageState.showSafetyAndBalance$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(false));
      component.pageState.emergencyStop$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({
            firstAttempt: 1,
            secondAttempt: 2,
          }));
      component.pageState.avoidance$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual({
            firstAttempt: 1,
            secondAttempt: 2,
          }));
      component.pageState.avoidanceAttempted$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(true));
      component.pageState.grade$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual('test1'));
      component.pageState.immediateDanger$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(false));

    });
  });

  describe('showVehicleChecksArrayCard', () => {
    [
      TestCategory.BE,
      TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
      TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
      TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K,
    ].forEach((value) => {
      it(`should return true if category is ${value}`, () => {
        component.testCategory = value;
        expect(component.showVehicleChecksArrayCard()).toEqual(true);
      });
    });
    it('should return false if the category is not listed', () => {
      component.testCategory = TestCategory.B;
      expect(component.showVehicleChecksArrayCard()).toEqual(false);
    });
  });
  describe('showADI3DebriefCard', () => {
    [
      TestCategory.ADI3, TestCategory.SC,
    ].forEach((value) => {
      it(`should return true if category is ${value}`, () => {
        component.testCategory = value;
        expect(component.showADI3DebriefCard()).toEqual(true);
      });
    });
    it('should return false if the category is not listed', () => {
      component.testCategory = TestCategory.B;
      expect(component.showADI3DebriefCard()).toEqual(false);
    });
  });
  describe('showCPCDebriefCard', () => {
    [
      TestCategory.CCPC, TestCategory.DCPC,
    ].forEach((value) => {
      it(`should return true if category is ${value}`, () => {
        component.testCategory = value;
        expect(component.showCPCDebriefCard()).toEqual(true);
      });
    });
    it('should return false if the category is not listed', () => {
      component.testCategory = TestCategory.B;
      expect(component.showCPCDebriefCard()).toEqual(false);
    });
  });
  describe('isCatD', () => {
    [
      TestCategory.D, TestCategory.D1,
      TestCategory.D1E, TestCategory.DE,
    ].forEach((value) => {
      it(`should return true if category is ${value}`, () => {
        component.testCategory = value;
        expect(component.isCatD()).toEqual(true);
      });
    });
    it('should return false if the category is not listed', () => {
      component.testCategory = TestCategory.B;
      expect(component.isCatD()).toEqual(false);
    });
  });
  describe('isTerminated', () => {
    it('should return true if outcome is OutcomeType.Terminated', () => {
      component.outcome = OutcomeType.Terminated;
      expect(component.isTerminated()).toEqual(true);
    });
    it('should return false if outcome is not OutcomeType.Terminated', () => {
      component.outcome = OutcomeType.Passed;
      expect(component.isTerminated()).toEqual(false);
    });
  });
  describe('isCategoryBTest', () => {
    it('should return true if outcome is OutcomeType.Terminated', () => {
      component.testCategory = TestCategory.B;
      expect(component.isCategoryBTest()).toEqual(true);
    });
    it('should return false if outcome is not OutcomeType.Terminated', () => {
      component.testCategory = TestCategory.D;
      expect(component.isCategoryBTest()).toEqual(false);
    });
  });
  describe('ionViewDidEnter', () => {
    it('should call dispatch with DebriefViewDidEnter', () => {
      spyOn(component.store$, 'dispatch');
      component.ionViewDidEnter();
      expect(component.store$.dispatch).toHaveBeenCalledWith(DebriefViewDidEnter());
    });
  });

  describe('endDebrief', () => {
    it('should call navigate with DASHBOARD_PAGE if isTestReportPracticeMode is true', () => {
      spyOn(component.router, 'navigate');
      component.isTestReportPracticeMode = true;

      component.endDebrief();
      expect(component.router.navigate).toHaveBeenCalledWith(['DashboardPage'], Object({ replaceUrl: true }));
    });
    it('should call navigate with PASS_FINALISATION_PAGE and the correct category if '
            + 'isTestReportPracticeMode is false and outcome is PASS', () => {
      spyOn(component['routeByCategoryProvider'], 'navigateToPage');
      component.isTestReportPracticeMode = false;
      component.outcome = TestOutcome.PASS;
      component.testCategory = TestCategory.B;

      component.endDebrief();
      expect(component['routeByCategoryProvider'].navigateToPage)
        .toHaveBeenCalledWith(TestFlowPageNames.PASS_FINALISATION_PAGE, TestCategory.B);
    });
    it('should call navigate with POST_DEBRIEF_HOLDING_PAGE if '
            + 'isTestReportPracticeMode is false and outcome is not PASS', () => {
      spyOn(component.router, 'navigate');
      component.isTestReportPracticeMode = false;
      component.outcome = TestOutcome.FAIL;

      component.endDebrief();
      expect(component.router.navigate).toHaveBeenCalledWith(['PostDebriefHoldingPage']);
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from subscription if there is one', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
    it('should unlock screenOrientation and run allowSleepAgain if '
        + 'isIos and isTestReportPracticeMode are true', () => {
      spyOn(PracticeableBasePageComponent.prototype, 'isIos').and.returnValue(true);
      spyOn(component.screenOrientation, 'unlock');
      spyOn(component.insomnia, 'allowSleepAgain');
      component.isTestReportPracticeMode = true;

      component.ionViewDidLeave();
      expect(component.screenOrientation.unlock).toHaveBeenCalled();
      expect(component.insomnia.allowSleepAgain).toHaveBeenCalled();
    });
  });
});
