import { mapAnalyticsScreenName } from '@shared/helpers/map-analytics-screen-name';

describe('mapAnalyticsScreenName()', () => {
  it('should return journal screen when JournalPage specified,', () => {
    const screenName = mapAnalyticsScreenName('JournalPage');
    expect(screenName).toEqual('journal screen');
  });

  it('should return rekey search screen when JourRekeySearchPagenalPage specified,', () => {
    const screenName = mapAnalyticsScreenName('RekeySearchPage');
    expect(screenName).toEqual('rekey search screen');
  });

  it('should return empty string when a page not in the analytics screen definition is specified,', () => {
    const screenName = mapAnalyticsScreenName('Other');
    expect(screenName).toEqual('');
  });
});
