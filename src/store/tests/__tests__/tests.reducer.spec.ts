import { Candidate, PreTestDeclarations, TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import * as candidateReducer from '@store/tests/journal-data/common/candidate/candidate.reducer';
import * as preTestDeclarationsReducer from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { NeverType } from '@pages/test-report/test-report.effects';
import { testReportPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import * as candidateActions from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as preTestDeclarationActions from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { TestsModel } from '../tests.model';
import * as testsActions from '../tests.actions';
import { testsReducer } from '../tests.reducer';

describe('testsReducer', () => {
  const newCandidate = { candidate: { candidateId: 456 } } as Candidate;
  const preTestDeclarations: PreTestDeclarations = preTestDeclarationsReducer.initialState;

  beforeEach(() => {
    candidateReducer.candidateReducer(null, candidateActions.PopulateCandidateDetails(newCandidate));
    preTestDeclarationsReducer.preTestDeclarationsReducer(null, preTestDeclarationActions.ClearPreTestDeclarations());
  });

  it('use the payload of a test started action to setup state for a new test', () => {
    const state = {
      currentTest: { slotId: null },
      startedTests: {},
      testStatus: {},
      completedTests: [],
    };
    const slotId = 123;
    const action = testsActions.StartTest(slotId, TestCategory.B);

    const output = testsReducer(state, action);

    expect(output.currentTest.slotId).toBe('123');
  });

  it('should use the payload of a start test report practice test action to setup state for a new test', () => {
    const state = {
      currentTest: { slotId: null },
      startedTests: {},
      testStatus: {},
      completedTests: [],
    };
    const slotId = testReportPracticeSlotId;
    const action = testsActions.StartTestReportPracticeTest(slotId);

    const output = testsReducer(state, action);

    expect(output.currentTest.slotId).toBe(testReportPracticeSlotId);
  });

  it('should reset the state when a test report practice test is started and not affect other tests', () => {
    const state: TestsModel = {
      currentTest: { slotId: testReportPracticeSlotId },
      startedTests: {
        1: {
          testData: {
            dangerousFaults: {},
            drivingFaults: {
              clearance: 1,
            },
            eyesightTest: {},
            manoeuvres: {},
            seriousFaults: {
              signalsTimed: true,
            },
            testRequirements: {},
            ETA: {},
            eco: {},
            controlledStop: {},
            vehicleChecks: {
              tellMeQuestion: {
                outcome: 'DF',
              },
              showMeQuestion: {
                outcome: 'S',
              },
            },
          },
          version: '0.0.1',
          category: null,
          journalData: null,
          activityCode: null,
          rekey: false,
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        [testReportPracticeSlotId]: {
          testData: {
            dangerousFaults: {},
            drivingFaults: {
              moveOffSafety: 1,
            },
            manoeuvres: {},
            seriousFaults: {
              positioningNormalDriving: true,
            },
            testRequirements: {},
            ETA: {},
            eco: {},
            controlledStop: {},
            vehicleChecks: {
              tellMeQuestion: {
                outcome: 'DF',
              },
              showMeQuestion: {},
            },
          },
          version: '0.0.1',
          category: null,
          journalData: null,
          activityCode: null,
          rekey: false,
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
      },
      testStatus: {},
    };
    const slotId = testReportPracticeSlotId;
    const action = testsActions.StartTestReportPracticeTest(slotId);

    const output = testsReducer(state, { ...action, category: TestCategory.B });

    const td = (
      output.startedTests[testReportPracticeSlotId] as NeverType<TestResultCommonSchema>
    ).testData as CatBUniqueTypes.TestData;
    const td1 = (output.startedTests[1] as NeverType<TestResultCommonSchema>).testData as CatBUniqueTypes.TestData;

    expect(td.seriousFaults.positioningNormalDriving).toBeUndefined();
    expect(td.drivingFaults.moveOffSafety).toBeUndefined();
    expect(td.vehicleChecks.tellMeQuestion.outcome).toBeUndefined();
    expect(td1.seriousFaults.signalsTimed).toEqual(true);
    expect(td1.drivingFaults.clearance).toEqual(1);
    expect(td1.vehicleChecks.tellMeQuestion.outcome).toEqual(CompetencyOutcome.DF);
    expect(td1.vehicleChecks.showMeQuestion.outcome).toEqual(CompetencyOutcome.S);
  });

  it('should ensure that all slot ids for test report practice tests are test_report_practice ', () => {
    const state = {
      currentTest: { slotId: null },
      startedTests: {},
      testStatus: {},
      completedTests: [],
    };
    const slotId = '123';
    const action = testsActions.StartTestReportPracticeTest(slotId);

    const output = testsReducer(state, action);

    expect(output.currentTest.slotId).toBe(testReportPracticeSlotId);
  });

  it('should derive the sub-states from sub-reducers', () => {
    const state: TestsModel = {
      currentTest: { slotId: null },
      startedTests: {},
      testStatus: {},
    };

    const result = testsReducer(state, testsActions.StartTest(123, TestCategory.B));
    expect(result.startedTests['123']['preTestDeclarations']).toBe(preTestDeclarations);
  });

  it('should assign the slot ID as the current test when a test is activated', () => {
    const state: TestsModel = {
      currentTest: { slotId: '123' },
      startedTests: {},
      testStatus: {},
    };

    const result = testsReducer(state, testsActions.ActivateTest(456, TestCategory.B));
    expect(result.currentTest.slotId).toBe('456');
  });

});
