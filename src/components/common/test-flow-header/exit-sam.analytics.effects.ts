import { Injectable } from '@angular/core';
import {
  ExitSAMCancelButtonClicked,
  ExitSAMErrorMessages,
  ExitSAMUserReturned,
  ExitSamActivated,
  ExitSamError,
} from '@components/common/test-flow-header/exit-sam.actions';
import { ExitSAMMethodUsed } from '@components/common/test-flow-header/test-flow-header.component';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { of, switchMap } from 'rxjs';
import { concatMap, filter, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class ExitSingleAppModeAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  exitSamActivated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExitSamActivated),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([{ method }, tests]: [ReturnType<typeof ExitSamActivated>, TestsModel, boolean]) => {
        // GA4 analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.EXIT_SAM, tests),
          GoogleAnalyticsEventsTitles.EXIT_TO_TEAMS,
          method === ExitSAMMethodUsed.BUTTON
            ? GoogleAnalyticsEventsValues.BUTTON_SELECTED
            : GoogleAnalyticsEventsValues.BANNER_SELECTED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  exitSamCancelled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExitSAMCancelButtonClicked),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof ExitSAMCancelButtonClicked>, TestsModel, boolean]) => {
        // GA4 analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.EXIT_SAM, tests),
          GoogleAnalyticsEventsTitles.PRESS_AND_HOLD,
          GoogleAnalyticsEventsValues.CANCELLED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  exitSamUserReturned$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExitSAMUserReturned),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof ExitSAMUserReturned>, TestsModel, boolean]) => {
        // GA4 analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.EXIT_SAM, tests),
          GoogleAnalyticsEventsTitles.APP_RESUMED,
          GoogleAnalyticsEventsValues.CONFIRMED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  exitSAMError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExitSamError),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([{ errorMessage, errorData }, tests]: [ReturnType<typeof ExitSamError>, TestsModel, boolean]) => {
        let errorString: string;
        switch (errorMessage) {
          case ExitSAMErrorMessages.DISABLE_SAM:
            errorString = GoogleAnalyticsEventsTitles.SAM_NOT_DISABLED;
            break;
          case ExitSAMErrorMessages.TEAMS_NOT_FOUND:
            errorString = GoogleAnalyticsEventsTitles.TEAMS_NOT_FOUND;
            break;
          case ExitSAMErrorMessages.COULD_NOT_EXIT_TO_TEAMS:
            errorString = GoogleAnalyticsEventsTitles.TEAMS_NOT_OPENED;
            break;
          default:
            errorString = null;
            break;
        }

        if (errorString) {
          // GA4 analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.EXIT_SAM, tests),
            errorString,
            GoogleAnalyticsEventsValues.ERROR_MODAL
          );
        }
        return of(AnalyticRecorded());
      })
    )
  );
}
