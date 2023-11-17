import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { switchMap } from 'rxjs/operators';
import { AnalyticsEventCategories, AnalyticsEvents, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AccordionClosed,
  AccordionOpened,
  ColourFilterChanged,
  DateRangeChanged,
  ExaminerStatsViewDidEnter,
  HideChartsActivated,
  HideChartsDeactivated,
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

  accordionOpened$ = createEffect(() => this.actions$.pipe(
    ofType(AccordionOpened),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.EXAMINER_STATS,
        AnalyticsEvents.ADDITIONAL_FILTERS_TOGGLED,
        'Additional filters opened',
      );
      return of(AnalyticRecorded());
    }),
  ));
  accordionClosed$ = createEffect(() => this.actions$.pipe(
    ofType(AccordionClosed),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.EXAMINER_STATS,
        AnalyticsEvents.ADDITIONAL_FILTERS_TOGGLED,
        'Additional filters closed',
      );
      return of(AnalyticRecorded());
    }),
  ));

  hideChartsEnabled$ = createEffect(() => this.actions$.pipe(
    ofType(HideChartsActivated),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.EXAMINER_STATS,
        AnalyticsEvents.HIDE_CHARTS_CHANGED,
        'Charts hidden',
      );
      return of(AnalyticRecorded());
    }),
  ));
  hideChartsDisabled$ = createEffect(() => this.actions$.pipe(
    ofType(HideChartsDeactivated),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.EXAMINER_STATS,
        AnalyticsEvents.HIDE_CHARTS_CHANGED,
        'Charts unhidden',
      );
      return of(AnalyticRecorded());
    }),
  ));
}
