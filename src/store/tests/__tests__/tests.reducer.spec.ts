import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Candidate, PreTestDeclarations } from '@dvsa/mes-test-schema/categories/common';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';

import { testsReducer } from '../tests.reducer';
import * as candidateReducer from '../journal-data/common/candidate/candidate.reducer';
import * as preTestDeclarationsReducer from '../pre-test-declarations/pre-test-declarations.reducer';
import { TestsModel } from '../tests.model';
import * as testsActions from '../tests.actions';
import { CompetencyOutcome } from '../../../app/shared/models/competency-outcome';
import { testReportPracticeSlotId } from '../../../app/shared/mocks/test-slot-ids.mock';

describe('testsReducer', () => {
  const newCandidate = { candidate: { candidateId: 456 } } as Candidate;
  const preTestDeclarations: PreTestDeclarations = preTestDeclarationsReducer.initialState;

  beforeEach(() => {
    spyOn(candidateReducer, 'candidateReducer').and.returnValue(newCandidate);
    spyOn(preTestDeclarationsReducer, 'preTestDeclarationsReducer').and.returnValue(preTestDeclarations);
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
    const action = testsActions.StartTestReportPracticeTest(1234);
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
        1234: {
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
    const slotId = 1234;
    const action = testsActions.StartTestReportPracticeTest(slotId);

    const output = testsReducer(state, { ...action, category: TestCategory.B });

    expect((output.startedTests[testReportPracticeSlotId].testData as CatBUniqueTypes.TestData)
      .seriousFaults.positioningNormalDriving)
      .toBeUndefined();
    expect((output.startedTests[testReportPracticeSlotId].testData as CatBUniqueTypes.TestData)
      .drivingFaults.moveOffSafety)
      .toBeUndefined();
    expect((output.startedTests[testReportPracticeSlotId].testData as CatBUniqueTypes.TestData)
      .vehicleChecks.tellMeQuestion.outcome)
      .toBeUndefined();

    expect((output.startedTests[1].testData as CatBUniqueTypes.TestData).seriousFaults.signalsTimed).toEqual(true);
    expect((output.startedTests[1].testData as CatBUniqueTypes.TestData).drivingFaults.clearance).toEqual(1);
    expect((output.startedTests[1].testData as CatBUniqueTypes.TestData).vehicleChecks.tellMeQuestion.outcome)
      .toEqual(CompetencyOutcome.DF);
    expect((output.startedTests[1].testData as CatBUniqueTypes.TestData).vehicleChecks.showMeQuestion.outcome)
      .toEqual(CompetencyOutcome.S);
  });

  it('should ensure that all slot ids for test report practice tests are test_report_practice ', () => {
    const state = {
      currentTest: { slotId: null },
      startedTests: {},
      testStatus: {},
      completedTests: [],
    };
    const slotId = 123;
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

    expect(candidateReducer.candidateReducer).toHaveBeenCalled();
    expect(preTestDeclarationsReducer.preTestDeclarationsReducer).toHaveBeenCalled();
    expect(result.startedTests['123'].journalData.candidate).toBe(newCandidate);
    expect(result.startedTests['123'].preTestDeclarations).toBe(preTestDeclarations);
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
