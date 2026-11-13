import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
} from '@providers/analytics/analytics.model';

import { Action } from '@ngrx/store';
import * as fakeJournalActions from '../fake-journal.actions';
import { FakeJournalAnalyticsEffects } from '../fake-journal.analytics.effects';

describe('FakeJournalAnalyticsEffects', () => {
  let effects: FakeJournalAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  const screenName = AnalyticsScreenNames.FAKE_JOURNAL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FakeJournalAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(FakeJournalAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
  });

  describe('fakeJournalViewDidEnter', () => {
    it('should call setCurrentPage', async () => {
      actions$.next(fakeJournalActions.FakeJournalDidEnter());
      const result = await firstValueFrom(effects.fakeJournalViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
  });

  describe('practiceStartFullTestAnalyticsEffect$', () => {
    it('should log an event with the started category', async () => {
      actions$.next(fakeJournalActions.StartE2EPracticeTest('123', TestCategory.B));
      const result = await firstValueFrom(effects.practiceStartFullTestAnalyticsEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.PRACTICE_MODE_NAVIGATION,
        GoogleAnalyticsEventsTitles.FULL_MODE_SELECTED,
        TestCategory.B
      );
    });
  });
});
