import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  BackButtonClick,
  BackToDebrief,
  ConfirmTestDetailsViewDidEnter,
} from '@pages/confirm-test-details/confirm-test-details.actions';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { select, Store } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { isPracticeMode } from '@store/tests/tests.selector';
import { AppConfigProvider } from '@providers/app-config/app-config';

@Injectable()
export class ConfirmTestDetailsAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  confirmTestDetailsView$ = createEffect(() => this.actions$.pipe(
    ofType(ConfirmTestDetailsViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]: [ReturnType<typeof ConfirmTestDetailsViewDidEnter>, TestsModel, boolean],
    ) => {
      // GA4 Analytics
      this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.CONFIRM_TEST_DETAILS, tests));
      return of(AnalyticRecorded());
    }),
  ));

  backToDebriefClicked$ = createEffect(() => this.actions$.pipe(
    ofType(BackToDebrief),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap(([, ]: [ReturnType<typeof BackToDebrief>, TestsModel, boolean]) => {
      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.NAVIGATION,
        GoogleAnalyticsEventsTitles.BACK,
        GoogleAnalyticsEventsValues.DEBRIEF
      );
      return of(AnalyticRecorded());
    }),
  ));

  backButtonClicked$ = createEffect(() => this.actions$.pipe(
    ofType(BackButtonClick),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap(([,]: [ReturnType<typeof BackButtonClick>, TestsModel, boolean]) => {

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.NAVIGATION,
        GoogleAnalyticsEventsTitles.BACK,
        GoogleAnalyticsEventsValues.FINALISE_OUTCOME
      );
      return of(AnalyticRecorded());
    }),
  ));
}
