import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import {
  BackButtonClick,
  BackToDebrief,
  ConfirmTestDetailsViewDidEnter,
} from '@pages/confirm-test-details/confirm-test-details.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class ConfirmTestDetailsAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  confirmTestDetailsView$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfirmTestDetailsViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof ConfirmTestDetailsViewDidEnter>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.setCurrentPage(AnalyticsScreenNames.CONFIRM_TEST_DETAILS);
        // GA4 Analytics
        this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.CONFIRM_TEST_DETAILS, tests));
        return of(AnalyticRecorded());
      })
    )
  );

  backToDebriefClicked$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BackToDebrief),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof BackToDebrief>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.NAVIGATION, tests),
          formatAnalyticsText(AnalyticsEvents.BACK, tests),
          'Back to debrief'
        );
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.BACK,
          GoogleAnalyticsEventsValues.DEBRIEF
        );
        return of(AnalyticRecorded());
      })
    )
  );

  backButtonClicked$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BackButtonClick),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof BackButtonClick>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.NAVIGATION, tests),
          formatAnalyticsText(AnalyticsEvents.BACK, tests),
          'Back to finalise outcome'
        );
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.BACK,
          GoogleAnalyticsEventsValues.FINALISE_OUTCOME
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
