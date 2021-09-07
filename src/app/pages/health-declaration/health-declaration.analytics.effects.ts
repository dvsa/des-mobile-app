import { Injectable } from '@angular/core';
import {
  Actions, createEffect, ofType,
} from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, concatMap, withLatestFrom } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames, AnalyticsErrorTypes,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { TestsModel } from '@store/tests/tests.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import * as healthDeclarationActions from './health-declaration.actions';

@Injectable()
export class HealthDeclarationAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  healthDeclarationViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(healthDeclarationActions.HealthDeclarationViewDidEnter),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([, tests]: [ReturnType<typeof healthDeclarationActions.HealthDeclarationViewDidEnter>, TestsModel]) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.HEALTH_DECLARATION, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

  validationErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(healthDeclarationActions.HealthDeclarationValidationError),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    switchMap(([
      action,
      tests]: [ReturnType<typeof healthDeclarationActions.HealthDeclarationValidationError>, TestsModel]) => {
      const formattedScreenName = formatAnalyticsText(AnalyticsScreenNames.HEALTH_DECLARATION, tests);
      this.analytics.logError(
        `${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
