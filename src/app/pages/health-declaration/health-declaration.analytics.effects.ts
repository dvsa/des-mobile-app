import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsErrorTypes, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { select, Store } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { TestsModel } from '@store/tests/tests.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { isPracticeMode } from '@store/tests/tests.selector';
import { AppConfigProvider } from '@providers/app-config/app-config';
import {
  HealthDeclarationValidationError,
  HealthDeclarationViewDidEnter,
} from '@pages/health-declaration/health-declaration.actions';

@Injectable()
export class HealthDeclarationAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  healthDeclarationViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(HealthDeclarationViewDidEnter),
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
      [, tests]: [ReturnType<typeof HealthDeclarationViewDidEnter>, TestsModel, boolean],
    ) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.HEALTH_DECLARATION, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

  validationErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(HealthDeclarationValidationError),
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
      [action, tests]: [ReturnType<typeof HealthDeclarationValidationError>, TestsModel, boolean],
    ) => {
      const formattedScreenName = formatAnalyticsText(AnalyticsScreenNames.HEALTH_DECLARATION, tests);
      this.analytics.logError(
        `${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
