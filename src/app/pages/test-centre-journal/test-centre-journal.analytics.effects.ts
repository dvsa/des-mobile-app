import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames,
  AnalyticsEventCategories,
  AnalyticsEvents,
  JournalRefreshModes,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  TestCentreJournalGetData,
  TestCentreJournalViewDidEnter,
} from '@pages/test-centre-journal/test-centre-journal.actions';

@Injectable()
export class TestCentreJournalAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  testCentreJournalView$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalViewDidEnter),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.TEST_CENTRE_JOURNAL);
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalRefresh$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalGetData),
    switchMap((action: ReturnType<typeof TestCentreJournalGetData>) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
        AnalyticsEvents.REFRESH_TC_JOURNAL,
        action.manualRefresh ? JournalRefreshModes.MANUAL : JournalRefreshModes.AUTOMATIC,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
