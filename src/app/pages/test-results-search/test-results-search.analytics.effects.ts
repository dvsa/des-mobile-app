import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  PerformApplicationReferenceSearch,
  PerformDriverNumberSearch,
  PerformLDTMSearch,
  TestResultSearchViewDidEnter,
} from './test-results-search.actions';

@Injectable()
export class TestResultsSearchAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions
  ) {}

  testResultSearchViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestResultSearchViewDidEnter),
      switchMap(() => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.setCurrentPage(AnalyticsScreenNames.TEST_RESULTS_SEARCH);
        //GA4 Analytics
        this.analytics.setGACurrentPage(AnalyticsScreenNames.TEST_RESULTS_SEARCH);
        return of(AnalyticRecorded());
      })
    )
  );

  performApplicationReferenceSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PerformApplicationReferenceSearch),
      switchMap(() => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          AnalyticsEventCategories.TEST_RESULTS_SEARCH,
          AnalyticsEvents.APPLICATION_REFERENCE_SEARCH
        );
        //GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.COMPLETED_TEST_SEARCH,
          GoogleAnalyticsEventsTitles.FILTER,
          GoogleAnalyticsEventsValues.APP_REF
        );
        return of(AnalyticRecorded());
      })
    )
  );

  performDriverNumberSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PerformDriverNumberSearch),
      switchMap(() => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(AnalyticsEventCategories.TEST_RESULTS_SEARCH, AnalyticsEvents.DRIVER_NUMBER_SEARCH);
        //GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.COMPLETED_TEST_SEARCH,
          GoogleAnalyticsEventsTitles.FILTER,
          GoogleAnalyticsEventsValues.DRIVER_NUMBER
        );
        return of(AnalyticRecorded());
      })
    )
  );

  performLDTMSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PerformLDTMSearch),
      switchMap((action: ReturnType<typeof PerformLDTMSearch>) => {
        // TODO - MES-9495 - remove old analytics
        const searchParametersUsed: string[] = [];
        let label = '';

        if (action.advancedSearchParams.startDate || action.advancedSearchParams.endDate) {
          searchParametersUsed.push('date');
        }

        if (action.advancedSearchParams.staffNumber) {
          searchParametersUsed.push('staff id');
        }

        if (action.advancedSearchParams.costCode) {
          searchParametersUsed.push('test centre');
        }

        if (action.advancedSearchParams.activityCode) {
          searchParametersUsed.push('activity code');
        }

        if (action.advancedSearchParams.category) {
          searchParametersUsed.push('test category');
        }

        if (action.advancedSearchParams.passCertificateNumber) {
          searchParametersUsed.push('pass certificate');
        }

        if (action.advancedSearchParams.rekey) {
          searchParametersUsed.push('rekey');
        }

        searchParametersUsed.forEach((searchParameter) => {
          if (label === '') {
            label = searchParameter;
            return;
          }
          label = `${label}, ${searchParameter}`;
        });

        this.analytics.logEvent(AnalyticsEventCategories.TEST_RESULTS_SEARCH, AnalyticsEvents.LDTM_SEARCH, label);
        //GA4 Analytics
        this.analytics.logGAEvent(GoogleAnalyticsEvents.LDTM_SEARCH, GoogleAnalyticsEventsTitles.FILTER, label);
        return of(AnalyticRecorded());
      })
    )
  );
}
