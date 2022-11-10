import { waitForAsync, TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsScreenNames, AnalyticsEventCategories, AnalyticsEvents,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { RekeySearchAnalyticsEffects } from '../rekey-search.analytics.effects';
import * as rekeySearchActions from '../rekey-search.actions';

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
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.REKEY_SEARCH,
          AnalyticsEvents.TEST_BOOKING_SEARCH,
        );
        done();
      });
    });
  });
});
