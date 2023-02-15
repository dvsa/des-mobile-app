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
  TestCentreJournalDateNavigation,
  TestCentreJournalGetData,
  TestCentreJournalSelectCandidate,
  TestCentreJournalSelectExaminer,
  TestCentreJournalSelectTestCentre,
  TestCentreJournalShowBookings,
  TestCentreJournalShowJournals,
  TestCentreJournalTabChanged,
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

  testCentreJournalSelectTestCentre$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalSelectTestCentre),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
        AnalyticsEvents.CHANGE_LOCATION,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalTabChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalTabChanged),
    switchMap(({ tab }: ReturnType<typeof TestCentreJournalTabChanged>) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
        AnalyticsEvents.TAB_SELECTION,
        tab,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalSelectCandidate$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalSelectCandidate),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
        AnalyticsEvents.CANDIDATE_SELECTION,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalShowBookings$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalShowBookings),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
        AnalyticsEvents.BUTTON_SELECTION,
        'Show booking',
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalSelectExaminer$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalSelectExaminer),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
        AnalyticsEvents.EXAMINER_SELECTION,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalShowJournals$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalShowJournals),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
        AnalyticsEvents.BUTTON_SELECTION,
        'Show journals',
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalDateNavigation$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalDateNavigation),
    switchMap(({ day }) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
        AnalyticsEvents.NAVIGATION,
        day,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
