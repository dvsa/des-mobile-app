import { AnalyticsEventCategories } from '@providers/analytics/analytics.model';

import { TestsModel } from '../../../store/tests/tests.model';
import {
  getCurrentTest,
  isDelegatedTest,
  isEndToEndPracticeTest,
  isTestReportPracticeTest,
} from '../../../store/tests/tests.selector';

export function formatAnalyticsText(eventText: string, tests: TestsModel): string {
  if (isEndToEndPracticeTest(tests)) {
    return `${AnalyticsEventCategories.PRACTICE_MODE} - ${eventText}`;
  }
  if (isTestReportPracticeTest(tests)) {
    return `${AnalyticsEventCategories.PRACTICE_TEST} - ${eventText}`;
  }
  if (isDelegatedTest(tests)) {
    return `${AnalyticsEventCategories.DELEGATED_TEST} - ${eventText}`;
  }
  if (getCurrentTest(tests).rekey) {
    return `${AnalyticsEventCategories.REKEY} - ${eventText}`;
  }
  return eventText;
}
