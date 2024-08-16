import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames,
  JournalRefreshModes,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsValues,
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
      // GA4 Analytics
      this.analytics.setGACurrentPage(AnalyticsScreenNames.TEST_CENTRE_JOURNAL);
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalRefresh$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalGetData),
    switchMap((action: ReturnType<typeof TestCentreJournalGetData>) => {
      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.REFRESH,
        action.manualRefresh ? JournalRefreshModes.MANUAL : JournalRefreshModes.AUTOMATIC,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalSelectTestCentre$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalSelectTestCentre),
    switchMap(() => {
      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.FILTER,
        GoogleAnalyticsEventsValues.LOCATION,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalTabChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalTabChanged),
    switchMap(({ tab }: ReturnType<typeof TestCentreJournalTabChanged>) => {
      // GA4 Analytics
      let eventValue = null;
      switch (tab) {
        case 'Candidate search':
          eventValue = GoogleAnalyticsEventsValues.CANDIDATE;
          break;
        case 'View Journals':
          eventValue = GoogleAnalyticsEventsValues.JOURNALS;
          break;
        default:
          eventValue = GoogleAnalyticsEventsValues.UNKNOWN;
      }
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.TAB_SELECTION,
        eventValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalSelectCandidate$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalSelectCandidate),
    switchMap(() => {
      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.FILTER,
        GoogleAnalyticsEventsValues.CANDIDATE,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalShowBookings$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalShowBookings),
    switchMap(() => {
      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
        GoogleAnalyticsEventsValues.BOOKINGS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalSelectExaminer$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalSelectExaminer),
    switchMap(() => {
      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.FILTER,
        GoogleAnalyticsEventsValues.EXAMINER,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalShowJournals$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalShowJournals),
    switchMap(() => {
      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
        GoogleAnalyticsEventsValues.JOURNALS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCentreJournalDateNavigation$ = createEffect(() => this.actions$.pipe(
    ofType(TestCentreJournalDateNavigation),
    switchMap(({ day }) => {
      // GA4 Analytics
      let eventValue = null;
      switch (day) {
        case 'today':
          eventValue = GoogleAnalyticsEventsValues.TODAY;
          break;
        case 'tomorrow':
          eventValue = GoogleAnalyticsEventsValues.TOMORROW;
          break;
        default:
          eventValue = GoogleAnalyticsEventsValues.UNKNOWN;
      }      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.NAVIGATION,
        eventValue,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
