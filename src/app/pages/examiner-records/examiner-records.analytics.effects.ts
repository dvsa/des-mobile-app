import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { switchMap } from 'rxjs/operators';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  ClickDataCard,
  ColourFilterChanged,
  DateRangeChanged, DisplayPartialBanner,
  ExaminerRecordsViewDidEnter,
  HideChartsChanged,
  LocationChanged, ReturnToDashboardPressed,
  TestCategoryChanged,
} from '@pages/examiner-records/examiner-records.actions';
import { ColourEnum } from '@providers/examiner-records/examiner-records';

@Injectable()
export class ExaminerRecordsAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  examinerStatsViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(ExaminerRecordsViewDidEnter),
    switchMap(() => {
      this.analytics.setGACurrentPage(AnalyticsScreenNames.EXAMINER_RECORDS);
      return of(AnalyticRecorded());
    }),
  ));

  dateRangeChanged$ = createEffect(() => this.actions$.pipe(
    ofType(DateRangeChanged),
    switchMap(({ selectedDate }) => {
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.DATE_RANGE_CHANGED,
        selectedDate.val,
      );
      return of(AnalyticRecorded());
    }),
  ));

  locationChanged$ = createEffect(() => this.actions$.pipe(
    ofType(LocationChanged),
    switchMap(({ location }) => {
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.LOCATION_FILTER,
        location.centreName,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testCategoryChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TestCategoryChanged),
    switchMap(({ testCategory }) => {
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.TEST_CATEGORY_FILTER,
        testCategory,
      );
      return of(AnalyticRecorded());
    }),
  ));

  colourFilterChanged$ = createEffect(() => this.actions$.pipe(
    ofType(ColourFilterChanged),
    switchMap(({ colour }) => {

      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        colour == ColourEnum.DEFAULT ?
          GoogleAnalyticsEventsTitles.DEFAULT_COLOUR : GoogleAnalyticsEventsTitles.GREYSCALE_COLOUR,
        GoogleAnalyticsEventsValues.SELECTED,
      );
      return of(AnalyticRecorded());
    }),
  ));

  returnToDashboardPressed$ = createEffect(() => this.actions$.pipe(
    ofType(ReturnToDashboardPressed),
    switchMap(() => {
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
        GoogleAnalyticsEventsValues.RETURN_TO_DASHBOARD,
      );
      return of(AnalyticRecorded());
    }),
  ));

  hideChartsChanged$ = createEffect(() => this.actions$.pipe(
    ofType(HideChartsChanged),
    switchMap(({ hideChart }) => {
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.CHART_VISUALISATION,
        hideChart ? GoogleAnalyticsEventsValues.SELECTED : GoogleAnalyticsEventsValues.UNSELECTED,
      );
      return of(AnalyticRecorded());
    }),
  ));

  partialBannerDisplayed$ = createEffect(() => this.actions$.pipe(
    ofType(DisplayPartialBanner),
    switchMap(() => {
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.DATA_UNAVAILABLE,
        GoogleAnalyticsEventsValues.DATA_BANNER_DISPLAY,
      );
      return of(AnalyticRecorded());
    }),
  ));

  onCardClicked$ = createEffect(() => this.actions$.pipe(
    ofType(ClickDataCard),
    switchMap(({ onClickData }) => {
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        onClickData.isExpanded == true ?
          GoogleAnalyticsEventsTitles.TAP_TO_SHOW : GoogleAnalyticsEventsTitles.TAP_TO_HIDE,
        onClickData.title,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
