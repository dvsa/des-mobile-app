import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
} from '@providers/analytics/analytics.model';
import { ReplaySubject } from 'rxjs';
import * as rekeySearchActions from '../rekey-search.actions';
import { RekeySearchAnalyticsEffects } from '../rekey-search.analytics.effects';

describe('RekeySearchAnalyticsEffects', () => {
  let effects: RekeySearchAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.REKEY_SEARCH;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        RekeySearchAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(RekeySearchAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    spyOn(analyticsProviderMock, 'logEvent');
  }));

  describe('rekeySearchViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      // ACT
      actions$.next(rekeySearchActions.RekeySearchViewDidEnter());
      // ASSERT
      effects.rekeySearchViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);

        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });
  describe('rekeySearchPerformed', () => {
    it('should log an event with the correct values', (done) => {
      // ACT
      actions$.next(rekeySearchActions.SearchBookedTest('', ''));
      // ASSERT
      effects.rekeySearchPerformed$.subscribe((result) => {
        expect(result?.type === AnalyticRecorded.type).toBe(true);

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.REKEY_SEARCH,
          AnalyticsEvents.TEST_BOOKING_SEARCH
        );

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(GoogleAnalyticsEvents.TEST_BOOKING_SEARCH);
        done();
      });
    });
  });
});
