import { AnalyticsEventCategories, GoogleAnalyticsEventPrefix } from '@providers/analytics/analytics.model';
import { TestsModel } from '@store/tests/tests.model';
import {
	getCurrentTest,
	isDelegatedTest,
	isEndToEndPracticeTest,
	isTestReportPracticeTest,
} from '@store/tests/tests.selector';

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
	// `.rekey` won't exist if no started tests
	if (getCurrentTest(tests)?.rekey) {
		return `${AnalyticsEventCategories.REKEY} - ${eventText}`;
	}
	return eventText;
}

/**
 * Prefix the analytic event with the appropriate prefix
 * for practice mode, delegated and rekeyed tests
 * Note: practice test and practice mode have been combined
 * @param eventText
 * @param tests
 */
export function analyticsEventTypePrefix(eventText: string, tests: TestsModel): string {
	if (isEndToEndPracticeTest(tests) || isTestReportPracticeTest(tests)) {
		return `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${eventText}`;
	}
	if (isDelegatedTest(tests)) {
		return `${GoogleAnalyticsEventPrefix.DELEGATED_TEST}_${eventText}`;
	}
	// rekey won't exist if no started tests
	if (getCurrentTest(tests)?.rekey) {
		return `${GoogleAnalyticsEventPrefix.REKEY}_${eventText}`;
	}
	return eventText;
}
