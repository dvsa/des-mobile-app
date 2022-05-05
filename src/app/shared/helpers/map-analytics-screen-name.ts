import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { PageNameKeys } from '@pages/page-names.constants';

/**
 * Map screen name from page name of component to the enum used for analytics
 * @param sourcePage
 */
export function mapAnalyticsScreenName(sourcePage: string): AnalyticsScreenNames {
  const screenName = {
    JournalPage: AnalyticsScreenNames.JOURNAL,
    TestCentreJournalPage: AnalyticsScreenNames.TEST_CENTRE_JOURNAL,
    RekeySearchPage: AnalyticsScreenNames.REKEY_SEARCH,
  } as Record<PageNameKeys, AnalyticsScreenNames>;

  return screenName[sourcePage] || '';
}
