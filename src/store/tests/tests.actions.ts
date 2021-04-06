import { createAction, union } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestsModel } from './tests.model';

export const START_SENDING_COMPLETED_TESTS = '[TestsEffects] Start Sending Completed Test';
export const SEND_COMPLETED_TESTS = '[TestsEffects] Send Completed Tests';
export const SEND_COMPLETED_TEST_SUCCESS = '[TestsEffects] Send Completed Tests Success';
export const SEND_COMPLETED_TESTS_FAILURE = '[TestsEffects] Send Completed Tests Failure';

export const SEND_CURRENT_TEST = '[TestsEffects] Send Current Test';
export const SEND_CURRENT_TEST_SUCCESS = '[Tests] Send Test Success';
export const SEND_CURRENT_TEST_FAILURE = '[Tests] Send Test Failure';

export const SEND_PARTIAL_TEST_SUCCESS = '[TestsEffects] Send Partial Tests Success';
export const SEND_PARTIAL_TESTS_FAILURE = '[TestsEffects] Send Partial Tests Failure';

export const START_TEST = '[Tests] Start Test';
export const PERSIST_TESTS = '[Tests] Persist';
export const LOAD_PERSISTED_TESTS = '[Tests] Load persisted';
export const LOAD_PERSISTED_TESTS_SUCCESS = '[Tests] Load persisted success';
export const START_TEST_REPORT_PRACTICE_TEST = '[Tests] Start practice test';
export const TEST_OUTCOME_CHANGED = '[TestReportEffects] Test outcome changed';
export const ACTIVATE_TEST = '[Tests] Activate Test';

export const PersistTests = createAction(
  PERSIST_TESTS,
);

export const LoadPersistedTests = createAction(
  LOAD_PERSISTED_TESTS,
);

export const LoadPersistedTestsSuccess = createAction(
  LOAD_PERSISTED_TESTS_SUCCESS,
  (tests: TestsModel) => ({ tests }),
);

export const TestOutcomeChanged = createAction(
  TEST_OUTCOME_CHANGED,
  (outcome: string) => ({ outcome }),
);

export const StartTest = createAction(
  START_TEST,
  (slotId: number, category: TestCategory, rekey: boolean = false, delegatedTest: boolean = false) => ({
    slotId,
    category,
    rekey,
    delegatedTest,
  }),
);

// Differs from START_TEST in that it won't trigger the journal -> test state copy effect
export const ActivateTest = createAction(
  ACTIVATE_TEST,
  (slotId: number, category: TestCategory, rekey: boolean = false) => ({
    slotId,
    category,
    rekey,
  }),
);

export const StartTestReportPracticeTest = createAction(
  START_TEST_REPORT_PRACTICE_TEST,
  (slotId: number, category: TestCategory = TestCategory.B) => ({
    slotId,
    category,
  }),
);

export const StartSendingCompletedTests = createAction(
  START_SENDING_COMPLETED_TESTS,
);

export const SendCompletedTests = createAction(
  SEND_COMPLETED_TESTS,
);

export const SendCompletedTestSuccess = createAction(
  SEND_COMPLETED_TEST_SUCCESS,
  (payload: string) => ({ payload }),
);

export const SendCompletedTestsFailure = createAction(
  SEND_COMPLETED_TESTS_FAILURE,
);

export const SendPartialTestSuccess = createAction(
  '[TestsEffects] Send Partial Tests Success',
  (payload: string) => ({ payload }),
);

export const SendPartialTestsFailure = createAction(
  '[TestsEffects] Send Partial Tests Failure',
);

export const SendCurrentTest = createAction(
  '[TestsEffects] Send Current Test',
);

export const SendCurrentTestSuccess = createAction(
  '[Tests] Send Test Success',
);

export const SendCurrentTestFailure = createAction(
  '[Tests] Send Test Failure',
  (failure: boolean) => ({ failure }),
);

const actions = union({
  PersistTests,
  LoadPersistedTests,
  LoadPersistedTestsSuccess,
  TestOutcomeChanged,
  StartTest,
  ActivateTest,
  StartTestReportPracticeTest,
  StartSendingCompletedTests,
  SendCompletedTests,
  SendCompletedTestSuccess,
  SendCompletedTestsFailure,
  SendCurrentTest,
  SendCurrentTestSuccess,
  SendCurrentTestFailure,
  SendPartialTestSuccess,
  SendPartialTestsFailure,
});

export type TestActionsTypes = typeof actions;
