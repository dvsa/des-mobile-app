import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, withLatestFrom, concatMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

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
  AnalyticsScreenNames,
  AnalyticsEventCategories,
  AnalyticsEvents,
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
      this.analytics.setCurrentPage(AnalyticsScreenNames.JOURNAL);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, '');
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '');
      return of(AnalyticRecorded());
    }),
  ));

  journalNavigation$ = createEffect(() => this.actions$.pipe(
    ofType(JournalNavigateDay),
    switchMap((action: ReturnType<typeof JournalNavigateDay>) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.JOURNAL,
        AnalyticsEvents.NAVIGATION,
        this.analytics.getDescriptiveDate(action.day),
      );

      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.JOURNAL_DAYS_FROM_TODAY,
        this.analytics.getDiffDays(action.day).toString(),
      );

      return of(AnalyticRecorded());
    }),
  ));

  journalRefresh$ = createEffect(() => this.actions$.pipe(
    ofType(JournalRefresh),
    switchMap((action: ReturnType<typeof JournalRefresh>) => {
      this.analytics.logEvent(AnalyticsEventCategories.JOURNAL, AnalyticsEvents.REFRESH_JOURNAL, action.mode);
      return of(AnalyticRecorded());
    }),
  ));

  earlyStartModalDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(EarlyStartModalDidEnter),
    switchMap(() => {
      this.analytics.logEvent(AnalyticsEventCategories.JOURNAL, AnalyticsEvents.DISPLAY_EARLY_START_MODAL);
      return of(AnalyticRecorded());
    }),
  ));

  earlyStartModalContinue$ = createEffect(() => this.actions$.pipe(
    ofType(EarlyStartDidContinue),
    switchMap(() => {
      this.analytics.logEvent(AnalyticsEventCategories.JOURNAL, AnalyticsEvents.EXIT_EARLY_START_MODAL_CONTINUE);
      return of(AnalyticRecorded());
    }),
  ));

  earlyStartModalReturn$ = createEffect(() => this.actions$.pipe(
    ofType(EarlyStartDidReturn),
    switchMap(() => {
      this.analytics.logEvent(AnalyticsEventCategories.JOURNAL, AnalyticsEvents.EXIT_EARLY_START_MODAL_RETURN);
      return of(AnalyticRecorded());
    }),
  ));

  journalRefreshError$ = createEffect(() => this.actions$.pipe(
    ofType(JournalRefreshError),
    switchMap((action: ReturnType<typeof JournalRefreshError>) => {
      this.analytics.logError(action.errorDescription, action.errorMessage);
      return of(AnalyticRecorded());
    }),
  ));

  slotChanged$ = createEffect(() => this.actions$.pipe(
    ofType(SlotHasChanged),
    switchMap((action: ReturnType<typeof SlotHasChanged>) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.JOURNAL,
        AnalyticsEvents.SLOT_CHANGED,
        action.slotId.toString(),
      );
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

      return of(AnalyticRecorded());
    }),
  ));

}
