import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsEventCategories, AnalyticsEvents, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  DashboardViewDidEnter, PracticeTestReportCard, SideMenuClosed, SideMenuItemSelected, SideMenuOpened,
} from './dashboard.actions';

@Injectable()
export class DashboardAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  dashboardViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(DashboardViewDidEnter),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.DASHBOARD);
      return of(AnalyticRecorded());
    }),
  ));

  practiceTestReportSelected$ = createEffect(() => this.actions$.pipe(
    ofType(PracticeTestReportCard),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.DASHBOARD,
        AnalyticsEvents.PRACTICE_TEST_SELECTED,
      );
      return of(AnalyticRecorded());
    }),
  ));

  sideMenuOpen$ = createEffect(() => this.actions$.pipe(
    ofType(SideMenuOpened),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.DASHBOARD,
        AnalyticsEvents.SIDE_MENU,
        'Menu Opened',
      );
      return of(AnalyticRecorded());
    }),
  ));

  sideMenuClosed$ = createEffect(() => this.actions$.pipe(
    ofType(SideMenuClosed),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.DASHBOARD,
        AnalyticsEvents.SIDE_MENU,
        'Menu Closed',
      );
      return of(AnalyticRecorded());
    }),
  ));

  sideMenuItemSelected$ = createEffect(() => this.actions$.pipe(
    ofType(SideMenuItemSelected),
    switchMap(({ item }) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.DASHBOARD,
        AnalyticsEvents.SIDE_MENU,
        `${item} Selected`,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
