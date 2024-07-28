import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import {
  HealthDeclarationValidationError,
  HealthDeclarationViewDidEnter,
} from '@pages/health-declaration/health-declaration.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsErrorTypes,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
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
export class HealthDeclarationAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  healthDeclarationViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HealthDeclarationViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof HealthDeclarationViewDidEnter>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        const screenName = formatAnalyticsText(AnalyticsScreenNames.HEALTH_DECLARATION, tests);
        this.analytics.setCurrentPage(screenName);

        //GA4 Analytics
        this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.HEALTH_DECLARATION, tests));
        return of(AnalyticRecorded());
      })
    )
  );

  validationErrorEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HealthDeclarationValidationError),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([action, tests]: [ReturnType<typeof HealthDeclarationValidationError>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        const formattedScreenName = formatAnalyticsText(AnalyticsScreenNames.HEALTH_DECLARATION, tests);
        this.analytics.logError(
          `${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`,
          action.errorMessage
        );

        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.VALIDATION_ERROR, tests),
          GoogleAnalyticsEventsTitles.BLANK_FIELD,
          action.errorMessage
        );

        return of(AnalyticRecorded());
      })
    )
  );
}
