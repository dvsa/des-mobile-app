import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames, GoogleAnalyticsEvents } from '@providers/analytics/analytics.model';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as rekeySearchActions from '../rekey-search.actions';
import { RekeySearchAnalyticsEffects } from '../rekey-search.analytics.effects';

describe('RekeySearchAnalyticsEffects', () => {
  let effects: RekeySearchAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  const screenName = AnalyticsScreenNames.REKEY_SEARCH;

  beforeEach(() => {
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
  });

  describe('rekeySearchViewDidEnter', () => {
    it('should call setCurrentPage', async () => {
      actions$.next(rekeySearchActions.RekeySearchViewDidEnter());
      const result = await firstValueFrom(effects.rekeySearchViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
  });
  describe('rekeySearchPerformed', () => {
    it('should log an event with the correct values', async () => {
      actions$.next(rekeySearchActions.SearchBookedTest('', ''));
      const result = await firstValueFrom(effects.rekeySearchPerformed$);
      expect(result?.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(GoogleAnalyticsEvents.TEST_BOOKING_SEARCH);
    });
  });
});
