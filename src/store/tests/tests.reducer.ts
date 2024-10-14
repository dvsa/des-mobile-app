import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { get } from 'lodash-es';

import { Action, createFeatureSelector } from '@ngrx/store';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { testReportPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import * as testsActions from './tests.actions';
import { LoadPersistedTestsSuccess, LoadRemoteTests } from './tests.actions';
import { TestsModel } from './tests.model';

import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { testStatusReducer } from './test-status/test-status.reducer';
import { testsReducerFactory } from './tests-reducer-factory';

export const initialState: TestsModel = {
  currentTest: { slotId: null },
  startedTests: {},
  testStatus: {},
};

export const testsFeatureKey = 'tests';

export interface TestResultRehydration {
  autosave: boolean;
  testData: TestResultSchemasUnion;
  slotId: string;
}

const deriveSlotId = (state: TestsModel, action: Action): string | null => {
  if (action.type === testsActions.StartTestReportPracticeTest.type) {
    return testReportPracticeSlotId;
  }

  if (
    action.type === testsActions.StartTest.type ||
    action.type === testsActions.ActivateTest.type ||
    action.type === fakeJournalActions.StartE2EPracticeTest.type
  ) {
    return `${(<ReturnType<typeof testsActions.StartTest>>action).slotId}`;
  }

  return state.currentTest?.slotId ? state.currentTest.slotId : null;
};

const deriveCategory = (state: TestsModel, action: Action, slotId: string | null): TestCategory => {
  if (
    action.type === testsActions.StartTest.type ||
    action.type === testsActions.ActivateTest.type ||
    action.type === testsActions.StartTestReportPracticeTest.type ||
    action.type === fakeJournalActions.StartE2EPracticeTest.type
  ) {
    return (<ReturnType<typeof testsActions.StartTest>>action).category;
  }

  return get(state.startedTests[slotId], 'category', null);
};

const createStateObject = (state: TestsModel, action: Action, slotId: string, category: TestCategory): TestsModel => {
  return {
    ...state,
    startedTests: {
      ...state.startedTests,
      [slotId]: {
        ...testsReducerFactory(category, action, state.startedTests[slotId]),
      },
    },
    currentTest: {
      slotId,
    },
    testStatus: testStatusReducer(state.testStatus, action),
  };
};

const removeTest = (state: TestsModel, slotId: string): TestsModel => {
  const { [slotId]: removedStartedTest, ...updatedStartedTests } = state.startedTests;
  const { [slotId]: removedTestStatus, ...updatedTestStatus } = state.testStatus;
  return {
    ...state,
    currentTest: {
      ...initialState.currentTest,
    },
    startedTests: updatedStartedTests,
    testStatus: updatedTestStatus,
  };
};

const hydrateRemoteTests = (state: TestsModel, testResults: TestResultRehydration[]): TestsModel => {
  let started = {};
  let ts = {};

  //Create a list of new startedTests and testStatuses
  testResults.forEach((testResult) => {
    started = {
      ...started,
      [testResult.slotId]: testResult.testData,
    };

    ts = {
      ...ts,
      [testResult.slotId]: testResult.autosave ? TestStatus.Autosaved : TestStatus.Submitted,
    };
  });

  //Append the new tests to the initial startedTests and testStatus objects
  return {
    ...state,
    startedTests: {
      // retain existing startedTests
      ...state.startedTests,
      ...started,
    },
    testStatus: {
      ...state.testStatus,
      ...ts,
    },
  };
};

/**
 * Handles actions relating to a particular test by finding which test the actions apply to
 * and applying a test capture domain concept reducer against that test's portion of the state.
 * @param state Test state for all tests
 * @param action The action to modify the state
 */
export function testsReducer(
  state = initialState,
  action: testsActions.TestActionsTypes | fakeJournalActions.Types
): TestsModel {
  const slotId = deriveSlotId(state, action);
  const category = deriveCategory(state, action, slotId);
  switch (action.type) {
    case testsActions.UnloadTests.type:
      return initialState;
    case testsActions.LoadRemoteTests.type:
      return hydrateRemoteTests(state, (<ReturnType<typeof LoadRemoteTests>>action).tests);
    case testsActions.LoadPersistedTestsSuccess.type:
      return (<ReturnType<typeof LoadPersistedTestsSuccess>>action).tests;
    case testsActions.StartTestReportPracticeTest.type:
      return slotId ? createStateObject(removeTest(state, slotId), action, slotId, category) : state;
    case fakeJournalActions.StartE2EPracticeTest.type:
      return slotId ? createStateObject(removeTest(state, slotId), action, slotId, category) : state;
    default:
      return slotId ? createStateObject(state, action, slotId, category) : state;
  }
}

export const getTests = createFeatureSelector<TestsModel>('tests');
