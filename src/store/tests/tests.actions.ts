import { createAction, union } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { TestsModel } from './tests.model';

export const UnloadTests = createAction(
  '[Tests] Unload Tests',
);

export const PersistTests = createAction(
  '[Tests] Persist',
);

export const LoadPersistedTests = createAction(
  '[Tests] Load persisted',
);

export const LoadPersistedTestsSuccess = createAction(
  '[Tests] Load persisted success',
  (tests: TestsModel) => ({ tests }),
);

export const LoadPersistedTestsFailure = createAction(
  '[Tests] Load persisted test failure',
);

export const TestOutcomeChanged = createAction(
  '[TestReportEffects] Test outcome changed',
  (outcome: string) => ({ outcome }),
);

export const StartTest = createAction(
  '[Tests] Start Test',
  (slotId: number,
    category: TestCategory,
    rekey: boolean = false,
    delegatedTest: boolean = false,
    startDate: string = null) => ({
    slotId,
    category,
    rekey,
    delegatedTest,
    startDate,
  }),
);

// Differs from START_TEST in that it won't trigger the journal -> test state copy effect
export const ActivateTest = createAction(
  '[Tests] Activate Test',
  (slotId: number, category: TestCategory, rekey: boolean = false) => ({
    slotId,
    category,
    rekey,
  }),
);

export const StartTestReportPracticeTest = createAction(
  '[Tests] Start practice test',
  (slotId: number | string, category: TestCategory = TestCategory.B) => ({
    slotId,
    category,
  }),
);

export const StartSendingCompletedTests = createAction(
  '[TestsEffects] Start Sending Completed Test',
);

export const SendCompletedTests = createAction(
  '[TestsEffects] Send Completed Tests',
);

export const SendCompletedTestSuccess = createAction(
  '[TestsEffects] Send Completed Tests Success',
  (payload: string, testStatus: TestStatus) => ({
    payload,
    testStatus,
  }),
);

export const SendCompletedTestsFailure = createAction(
  '[TestsEffects] Send Completed Tests Failure',
);

export const SendPartialTestSuccess = createAction(
  '[TestsEffects] Send Partial Tests Success',
  (payload: string, testStatus: TestStatus) => ({
    payload,
    testStatus,
  }),
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

export const SendCompletedNoneSent = createAction(
  '[Tests] No completed tests sent',
);

export const SendCurrentTestFailure = createAction(
  '[Tests] Send Test Failure',
  (failure: boolean) => ({ failure }),
);

const actions = union({
  UnloadTests,
  PersistTests,
  LoadPersistedTests,
  LoadPersistedTestsSuccess,
  LoadPersistedTestsFailure,
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
  SendCompletedNoneSent,
});

export type TestActionsTypes = typeof actions;
