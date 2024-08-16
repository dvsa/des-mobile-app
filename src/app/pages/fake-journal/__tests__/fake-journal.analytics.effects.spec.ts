import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents, GoogleAnalyticsEventsTitles,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';

import { FakeJournalAnalyticsEffects } from '../fake-journal.analytics.effects';
import * as fakeJournalActions from '../fake-journal.actions';

describe('FakeJournalAnalyticsEffects', () => {
  let effects: FakeJournalAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.FAKE_JOURNAL;

  beforeEach(waitForAsync(() => {
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
  }));

  describe('fakeJournalViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      actions$.next(fakeJournalActions.FakeJournalDidEnter());
      effects.fakeJournalViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);

        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });

  describe('practiceStartFullTestAnalyticsEffect$', () => {
    it('should log an event with the started category', (done) => {
      actions$.next(fakeJournalActions.StartE2EPracticeTest('123', TestCategory.B));
      effects.practiceStartFullTestAnalyticsEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.PRACTICE_MODE_NAVIGATION,
          GoogleAnalyticsEventsTitles.FULL_MODE_SELECTED,
          TestCategory.B,
        );
        done();
      });
    });
  });
});
