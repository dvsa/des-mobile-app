import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { GoogleAnalyticsEvents } from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { StoreModel } from '@shared/models/store.model';
import { getApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getJournalData, getTestById, isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, withLatestFrom } from 'rxjs/operators';
import * as testStatusActions from './test-status.actions';

@Injectable()
export class TestStatusAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  getCurrentAppRef(slotId: string) {
    let appRef = '';
    this.store$
      .pipe(
        select(getTests),
        select((state) => getTestById(state, slotId)),
        select(getJournalData),
        select(getApplicationReference)
      )
      .subscribe((applicationRef) => {
        appRef = formatApplicationReference(applicationRef);
      })
      .unsubscribe();
    return appRef;
  }

  setTestStatusDecidedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusDecided),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([action, tests]: [ReturnType<typeof testStatusActions.SetTestStatusDecided>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_DECIDED, tests),
          this.getCurrentAppRef(action.slotId)
        );
        return of(AnalyticRecorded());
      })
    )
  );

  setTestStatusWriteUpEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusWriteUp),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([action, tests]: [ReturnType<typeof testStatusActions.SetTestStatusWriteUp>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_IN_WRITE_UP, tests),
          this.getCurrentAppRef(action.slotId)
        );
        return of(AnalyticRecorded());
      })
    )
  );

  setTestStatusBookedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusBooked),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([action, tests]: [ReturnType<typeof testStatusActions.SetTestStatusBooked>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_BOOKED, tests),
          this.getCurrentAppRef(action.slotId)
        );
        return of(AnalyticRecorded());
      })
    )
  );

  setTestStatusStartedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusStarted),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([action, tests]: [ReturnType<typeof testStatusActions.SetTestStatusStarted>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_STARTED, tests),
          this.getCurrentAppRef(action.slotId)
        );
        return of(AnalyticRecorded());
      })
    )
  );

  setTestStatusCompletedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusCompleted),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(
        ([action, tests]: [ReturnType<typeof testStatusActions.SetTestStatusCompleted>, TestsModel, boolean]) => {
          // GA4 Analytics
          this.analytics.logGAEvent(
            GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
            analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_COMPLETED, tests),
            this.getCurrentAppRef(action.slotId)
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );

  setTestStatusAutosavedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusAutosaved),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(
        ([action, tests]: [ReturnType<typeof testStatusActions.SetTestStatusAutosaved>, TestsModel, boolean]) => {
          // GA4 Analytics
          this.analytics.logGAEvent(
            GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
            analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_AUTOSAVED, tests),
            this.getCurrentAppRef(action.slotId)
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );

  setTestStatusSubmittedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusSubmitted),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(
        ([action, tests]: [ReturnType<typeof testStatusActions.SetTestStatusSubmitted>, TestsModel, boolean]) => {
          // GA4 Analytics
          this.analytics.logGAEvent(
            GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
            analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_SUBMITTED, tests),
            this.getCurrentAppRef(action.slotId)
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );
}
