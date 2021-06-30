import {
  TestResultCommonSchema,
} from '@dvsa/mes-test-schema/categories/common';
import { ActivityCodes } from '@shared/models/activity-codes';

export const getTestOutcome = (test: TestResultCommonSchema): string => {
  switch (test.activityCode) {
    case ActivityCodes.PASS:
      return 'Pass';
    case ActivityCodes.FAIL:
    case ActivityCodes.FAIL_EYESIGHT:
    case ActivityCodes.FAIL_PUBLIC_SAFETY:
    case ActivityCodes.FAIL_CANDIDATE_STOPS_TEST:
      return 'Fail';
    default:
      return 'Terminated';
  }
};
