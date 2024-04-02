import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getTestById, isPassed } from '@store/tests/tests.selector';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { SlotHasChanged } from '@providers/slot/slot.actions';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { formatApplicationReference } from '@shared/helpers/formatters';
import {
  EarlyStartDidContinue,
  EarlyStartDidReturn,
  EarlyStartModalDidEnter,
  JournalNavigateDay,
  JournalRefresh,
  JournalRefreshError,
  JournalViewDidEnter,
  ResumingWriteUp,
} from '@store/journal/journal.actions';
import {
  AnalyticsDimensionIndices,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';

@Injectable()
export class JournalAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  journalView$ = createEffect(() => this.actions$.pipe(
    ofType(JournalViewDidEnter),
    switchMap(() => {

      // TODO - MES-9495 - remove old analytics
      this.analytics.setCurrentPage(AnalyticsScreenNames.JOURNAL);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, '');
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '');

      // GA4 Analytics
      this.analytics.setGACurrentPage(AnalyticsScreenNames.JOURNAL);
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, '');
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '');
      return of(AnalyticRecorded());
    }),
  ));

  journalNavigation$ = createEffect(() => this.actions$.pipe(
    ofType(JournalNavigateDay),
    switchMap((action: ReturnType<typeof JournalNavigateDay>) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.JOURNAL,
        AnalyticsEvents.NAVIGATION,
        this.analytics.getDescriptiveDate(action.day),
      );

      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.JOURNAL_DAYS_FROM_TODAY,
        this.analytics.getDiffDays(action.day).toString(),
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.NAVIGATION,
        this.analytics.getDescriptiveDate(action.day),
      );

      this.analytics.addGACustomDimension(
        AnalyticsDimensionIndices.JOURNAL_DAYS_FROM_TODAY,
        this.analytics.getDiffDays(action.day).toString(),
      );

      return of(AnalyticRecorded());
    }),
  ));

  journalRefresh$ = createEffect(() => this.actions$.pipe(
    ofType(JournalRefresh),
    switchMap((action: ReturnType<typeof JournalRefresh>) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(AnalyticsEventCategories.JOURNAL, AnalyticsEvents.REFRESH_JOURNAL, action.mode);
      // GA4 Analytics
      this.analytics.logGAEvent(GoogleAnalyticsEvents.JOURNAL, GoogleAnalyticsEventsTitles.REFRESH, action.mode);
      return of(AnalyticRecorded());
    }),
  ));

  earlyStartModalDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(EarlyStartModalDidEnter),
    switchMap(() => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(AnalyticsEventCategories.JOURNAL, AnalyticsEvents.DISPLAY_EARLY_START_MODAL);
      // GA4 Analytics
      this.analytics.logGAEvent(GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
        GoogleAnalyticsEventsValues.DISPLAY);
      return of(AnalyticRecorded());
    }),
  ));

  earlyStartModalContinue$ = createEffect(() => this.actions$.pipe(
    ofType(EarlyStartDidContinue),
    switchMap(() => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(AnalyticsEventCategories.JOURNAL, AnalyticsEvents.EXIT_EARLY_START_MODAL_CONTINUE);
      // GA4 Analytics
      this.analytics.logGAEvent(GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
        GoogleAnalyticsEventsValues.CONTINUE);
      return of(AnalyticRecorded());
    }),
  ));

  earlyStartModalReturn$ = createEffect(() => this.actions$.pipe(
    ofType(EarlyStartDidReturn),
    switchMap(() => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(AnalyticsEventCategories.JOURNAL, AnalyticsEvents.EXIT_EARLY_START_MODAL_RETURN);
      // GA4 Analytics
      this.analytics.logGAEvent(GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
        GoogleAnalyticsEventsValues.EXIT);
      return of(AnalyticRecorded());
    }),
  ));

  journalRefreshError$ = createEffect(() => this.actions$.pipe(
    ofType(JournalRefreshError),
    switchMap((action: ReturnType<typeof JournalRefreshError>) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logError(action.errorDescription, action.errorMessage);
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

      this.analytics.logGAEvent(GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.REFRESH,
        refreshType,
        GoogleAnalyticsEventsTitles.ERROR,
        action.errorMessage,
      );

      return of(AnalyticRecorded());
    }),
  ));

  slotChanged$ = createEffect(() => this.actions$.pipe(
    ofType(SlotHasChanged),
    switchMap((action: ReturnType<typeof SlotHasChanged>) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.JOURNAL,
        AnalyticsEvents.SLOT_CHANGED,
        action.slotId.toString(),
      );
      // GA4 Analytics
      this.analytics.logGAEvent(GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.SLOT_CHANGED,
        action.slotId.toString());
      return of(AnalyticRecorded());
    }),
  ));

  resumingWriteUpEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ResumingWriteUp),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]) => {
      const setTestStatusSubmittedAction = action as ReturnType<typeof ResumingWriteUp>;
      const test = getTestById(tests, setTestStatusSubmittedAction.slotId);
      const isTestPassed = isPassed(test);
      const journalDataOfTest = test.journalData;

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.POST_TEST,
        AnalyticsEvents.RESUME_WRITE_UP,
        isTestPassed ? 'pass' : 'fail',
      );

      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.APPLICATION_REFERENCE,
        formatApplicationReference(journalDataOfTest.applicationReference),
      );
      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.CANDIDATE_ID, journalDataOfTest.candidate.candidateId.toString(),
      );

      // GA4 Analytics
      this.analytics.logGAEvent(GoogleAnalyticsEvents.RESUME_WRITE_UP,
        GoogleAnalyticsEventsTitles.RESULT,
        isTestPassed ? GoogleAnalyticsEventsValues.PASS : GoogleAnalyticsEventsValues.FAIL);

      this.analytics.addGACustomDimension(
        AnalyticsDimensionIndices.APPLICATION_REFERENCE,
        formatApplicationReference(journalDataOfTest.applicationReference),
      );
      this.analytics.addGACustomDimension(
        AnalyticsDimensionIndices.CANDIDATE_ID, journalDataOfTest.candidate.candidateId.toString(),
      );

      return of(AnalyticRecorded());
    }),
  ));

}
