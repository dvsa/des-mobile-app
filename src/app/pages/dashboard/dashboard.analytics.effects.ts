import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsEventCategories, AnalyticsEvents, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { select, Store } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { StoreModel } from '@shared/models/store.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import {
  UpdateAvailableBadgeClicked,
  UpdateAvailableOptionClicked,
  UpdateAvailablePopup,
} from '@store/app-info/app-info.actions';
import {
  DashboardViewDidEnter,
  DetectDeviceTheme,
  PracticeTestReportCard,
  SideMenuClosed,
  SideMenuItemSelected,
  SideMenuOpened,
} from './dashboard.actions';
import { isDeviceThemeDarkMode } from '@shared/helpers/is-dark-mode';

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
    switchMap(([{ item }]) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.DASHBOARD,
        AnalyticsEvents.SIDE_MENU,
        `${item} Selected`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  updateAvailablePopup$ = createEffect(() => this.actions$.pipe(
    ofType(UpdateAvailablePopup),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    mergeMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.APP_UPDATE_BADGE,
        'Modal',
        'New version modal displayed',
      );
      return of(AnalyticRecorded());
    }),
  ));

  updateAvailableOptionClicked$ = createEffect(() => this.actions$.pipe(
    ofType(UpdateAvailableOptionClicked),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    mergeMap(([{ selected }]: [ReturnType<typeof UpdateAvailableOptionClicked>, boolean]) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.APP_UPDATE_BADGE,
        'Modal',
        `${selected} button selected`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  updateAvailableBadgeClicked$ = createEffect(() => this.actions$.pipe(
    ofType(UpdateAvailableBadgeClicked),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    mergeMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.APP_UPDATE_BADGE,
        'New version badge selected',
      );
      return of(AnalyticRecorded());
    }),
  ));

  detectDeviceTheme$ = createEffect(() => this.actions$.pipe(
    ofType(DetectDeviceTheme),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.METADATA,
        'Device theme',
        isDeviceThemeDarkMode() ? 'Dark mode' : 'Light mode',
      );
      return of(AnalyticRecorded());
    }),
  ));

}
