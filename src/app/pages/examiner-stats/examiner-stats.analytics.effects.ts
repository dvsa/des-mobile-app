import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { switchMap } from 'rxjs/operators';
import { AnalyticsEventCategories, AnalyticsEvents, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AccordionChanged,
  ColourFilterChanged,
  DateRangeChanged,
  ExaminerStatsViewDidEnter, HideChartsChanged,
  LocationChanged,
  TestCategoryChanged,
} from '@pages/examiner-stats/examiner-stats.actions';

@Injectable()
export class ExaminerStatsAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  examinerStatsViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(ExaminerStatsViewDidEnter),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.EXAMINER_STATS);
      return of(AnalyticRecorded());
    }),
  ));

  dateRangeChanged$ = createEffect(() => this.actions$.pipe(
    ofType(DateRangeChanged),
    switchMap(({ range }) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.EXAMINER_STATS,
        AnalyticsEvents.DATE_RANGE_CHANGED,
        range,
      );
      return of(AnalyticRecorded());
    }),
  ));

  locationChanged$ = createEffect(() => this.actions$.pipe(
    ofType(LocationChanged),
    switchMap(({ location }) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.EXAMINER_STATS,
        AnalyticsEvents.LOCATION_CHANGED,
        location,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCategoryChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TestCategoryChanged),
    switchMap(({ testCategory }) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.EXAMINER_STATS,
        AnalyticsEvents.TEST_CATEGORY_CHANGED,
        testCategory,
      );
      return of(AnalyticRecorded());
    }),
  ));

  colourFilterChanged$ = createEffect(() => this.actions$.pipe(
    ofType(ColourFilterChanged),
    switchMap(({ colour }) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.EXAMINER_STATS,
        AnalyticsEvents.COLOUR_SCHEME_CHANGED,
        colour,
      );
      return of(AnalyticRecorded());
    }),
  ));

  accordionChanged$ = createEffect(() => this.actions$.pipe(
    ofType(AccordionChanged),
    switchMap(({ isOpen }) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.EXAMINER_STATS,
        AnalyticsEvents.ADDITIONAL_FILTERS_TOGGLED,
        isOpen ? 'Additional filters opened' : 'Additional filters closed',
      );
      return of(AnalyticRecorded());
    }),
  ));

  hideChartsChanged$ = createEffect(() => this.actions$.pipe(
    ofType(HideChartsChanged),
    switchMap(({ hideChart }) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.EXAMINER_STATS,
        AnalyticsEvents.HIDE_CHARTS_CHANGED,
        hideChart ? 'Charts hidden' : 'Charts unhidden',
      );
      return of(AnalyticRecorded());
    }),
  ));
}
