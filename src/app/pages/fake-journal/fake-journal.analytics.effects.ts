import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsEventCategories, AnalyticsEvents,
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { FakeJournalDidEnter, StartE2EPracticeTest } from '@pages/fake-journal/fake-journal.actions';

@Injectable()
export class FakeJournalAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  fakeJournalViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(FakeJournalDidEnter),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.FAKE_JOURNAL);
      return of(AnalyticRecorded());
    }),
  ));

  practiceStartFullTestAnalyticsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(StartE2EPracticeTest),
    switchMap(({ category }: ReturnType<typeof StartE2EPracticeTest>) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.FAKE_JOURNAL,
        AnalyticsEvents.PRACTICE_FULL_TEST_SELECTED,
        category,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
