import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsEventCategories, AnalyticsEvents, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { select, Store } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { StoreModel } from '@shared/models/store.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import {
  DashboardViewDidEnter,
  PracticeTestReportCard,
  SideMenuClosed,
  SideMenuItemSelected,
  SideMenuOpened,
} from './dashboard.actions';

@Injectable()
export class DashboardAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  dashboardViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(DashboardViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.DASHBOARD);
      return of(AnalyticRecorded());
    }),
  ));

  practiceTestReportSelected$ = createEffect(() => this.actions$.pipe(
    ofType(PracticeTestReportCard),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
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
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
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
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
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
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap(([{ item }]) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.DASHBOARD,
        AnalyticsEvents.SIDE_MENU,
        `${item} Selected`,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
