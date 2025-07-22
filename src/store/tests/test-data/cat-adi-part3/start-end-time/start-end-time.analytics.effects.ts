import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { StandardsChecksTestIsTooShortReasonChanged } from '@store/tests/test-data/cat-adi-part3/start-end-time/start-end-time.actions';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class StartEndTimeAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Actions,
    private appConfigProvider: AppConfigProvider // Assuming this is the correct provider for app config
  ) {}

  standardsChecksTestIsTooShortReasonChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StandardsChecksTestIsTooShortReasonChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof StandardsChecksTestIsTooShortReasonChanged>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.REASON_SHORT_TIME,
          GoogleAnalyticsEventsTitles.REASON,
          GoogleAnalyticsEventsValues.FREE_TEXT_ENTERED
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
