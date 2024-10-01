import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { SlotHasChanged } from '@providers/slot/slot.actions';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { StoreModel } from '@shared/models/store.model';
import {
  EarlyStartDidContinue,
  EarlyStartDidReturn,
  EarlyStartModalDidEnter,
  JournalNavigateDay,
  JournalRefresh,
  JournalRefreshError,
  JournalRehydrationError,
  JournalRehydrationNull,
  JournalRehydrationSuccess,
  JournalViewDidEnter,
  ResumingWriteUp,
} from '@store/journal/journal.actions';
import { JournalRehydrationPage, JournalRehydrationType } from '@store/journal/journal.effects';
import { getTests } from '@store/tests/tests.reducer';
import { getTestById, isPassed } from '@store/tests/tests.selector';

@Injectable()
export class JournalAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>
  ) {}

  journalView$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JournalViewDidEnter),
      switchMap(() => {
        // GA4 Analytics
        this.analytics.setGACurrentPage(AnalyticsScreenNames.JOURNAL);
        // reset values for custom dimensions
        this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, '');
        this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE, '');
        this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.TEST_CATEGORY, '');
        return of(AnalyticRecorded());
      })
    )
  );

  journalNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JournalNavigateDay),
      switchMap((action: ReturnType<typeof JournalNavigateDay>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.NAVIGATION,
          this.analytics.getDescriptiveDate(action.day)
        );

        this.analytics.addGACustomDimension(
          GoogleAnalyticsCustomDimension.JOURNAL_DAYS_FROM_TODAY,
          this.analytics.getDiffDays(action.day).toString()
        );

        return of(AnalyticRecorded());
      })
    )
  );

  journalRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JournalRefresh),
      switchMap((action: ReturnType<typeof JournalRefresh>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(GoogleAnalyticsEvents.JOURNAL, GoogleAnalyticsEventsTitles.REFRESH, action.mode);
        return of(AnalyticRecorded());
      })
    )
  );

  getRehydrationPageType(page: JournalRehydrationPage): GoogleAnalyticsEvents {
    return page === JournalRehydrationPage.DASHBOARD ? GoogleAnalyticsEvents.DASHBOARD : GoogleAnalyticsEvents.JOURNAL;
  }

  getRehydrationType(refreshType: JournalRehydrationType): GoogleAnalyticsEventsValues {
    return refreshType === JournalRehydrationType.AUTO
      ? GoogleAnalyticsEventsValues.AUTOMATIC
      : GoogleAnalyticsEventsValues.MANUAL;
  }

  journalRehydrationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JournalRehydrationSuccess),
      switchMap((action: ReturnType<typeof JournalRehydrationSuccess>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          this.getRehydrationPageType(action.page),
          GoogleAnalyticsEventsTitles.REHYDRATION,
          `${this.getRehydrationType(action.refreshType)}_${GoogleAnalyticsEventsValues.COMPLETED}`
        );
        return of(AnalyticRecorded());
      })
    )
  );

  journalRehydrationNull$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JournalRehydrationNull),
      switchMap((action: ReturnType<typeof JournalRehydrationNull>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          this.getRehydrationPageType(action.page),
          GoogleAnalyticsEventsTitles.REHYDRATION,
          `${this.getRehydrationType(action.refreshType)}_${GoogleAnalyticsEventsValues.NULL}`
        );

        return of(AnalyticRecorded());
      })
    )
  );

  journalRehydrationError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JournalRehydrationError),
      switchMap((action: ReturnType<typeof JournalRehydrationError>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          this.getRehydrationPageType(action.page),
          GoogleAnalyticsEventsTitles.REHYDRATION,
          `${this.getRehydrationType(action.refreshType)}_${GoogleAnalyticsEventsValues.ERROR}`
        );

        return of(AnalyticRecorded());
      })
    )
  );

  earlyStartModalDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EarlyStartModalDidEnter),
      switchMap(() => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
          GoogleAnalyticsEventsValues.DISPLAY
        );
        return of(AnalyticRecorded());
      })
    )
  );

  earlyStartModalContinue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EarlyStartDidContinue),
      switchMap(() => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
          GoogleAnalyticsEventsValues.CONTINUE
        );
        return of(AnalyticRecorded());
      })
    )
  );

  earlyStartModalReturn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EarlyStartDidReturn),
      switchMap(() => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
          GoogleAnalyticsEventsValues.EXIT
        );
        return of(AnalyticRecorded());
      })
    )
  );

  journalRefreshError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JournalRefreshError),
      switchMap((action: ReturnType<typeof JournalRefreshError>) => {
        // GA4 Analytics
        let refreshType = 'unknownJournalRefresh';
        switch (action.errorDescription) {
          case 'AutomaticJournalRefresh':
            refreshType = GoogleAnalyticsEventsValues.AUTOMATIC;
            break;
          case 'ManualJournalRefresh':
            refreshType = GoogleAnalyticsEventsValues.MANUAL;
            break;
        }

        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.REFRESH,
          refreshType,
          GoogleAnalyticsEventsTitles.ERROR,
          action.errorMessage
        );

        return of(AnalyticRecorded());
      })
    )
  );

  slotChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SlotHasChanged),
      switchMap((action: ReturnType<typeof SlotHasChanged>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.SLOT_CHANGED,
          action.slotId.toString()
        );
        return of(AnalyticRecorded());
      })
    )
  );

  resumingWriteUpEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResumingWriteUp),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests))))),
      switchMap(([action, tests]) => {
        const setTestStatusSubmittedAction = action as ReturnType<typeof ResumingWriteUp>;
        const test = getTestById(tests, setTestStatusSubmittedAction.slotId);
        const isTestPassed = isPassed(test);
        const journalDataOfTest = test.journalData;

        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.RESUME_WRITE_UP,
          GoogleAnalyticsEventsTitles.RESULT,
          isTestPassed ? GoogleAnalyticsEventsValues.PASS : GoogleAnalyticsEventsValues.FAIL
        );

        this.analytics.addGACustomDimension(
          GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
          formatApplicationReference(journalDataOfTest.applicationReference)
        );
        this.analytics.addGACustomDimension(
          GoogleAnalyticsCustomDimension.CANDIDATE_ID,
          journalDataOfTest.candidate.candidateId.toString()
        );

        return of(AnalyticRecorded());
      })
    )
  );
}
