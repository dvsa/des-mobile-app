import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents, GoogleAnalyticsEventsTitles, GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
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
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

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
      // TODO - MES-9495 - remove old analytics
      this.analytics.setCurrentPage(AnalyticsScreenNames.DASHBOARD);

      // GA4 analytics
      this.analytics.setGACurrentPage(AnalyticsScreenNames.DASHBOARD);
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

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.DASHBOARD,
        AnalyticsEvents.PRACTICE_TEST_SELECTED,
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.PRACTICE_MODE_NAVIGATION,
        GoogleAnalyticsEventsTitles.PRACTICE_TEST_SELECTED,
        TestCategory.B,
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
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.DASHBOARD,
        AnalyticsEvents.SIDE_MENU,
        'Menu Opened',
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.MENU,
        GoogleAnalyticsEventsTitles.STATUS,
        GoogleAnalyticsEventsValues.OPEN,
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

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.DASHBOARD,
        AnalyticsEvents.SIDE_MENU,
        'Menu Closed',
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.MENU,
        GoogleAnalyticsEventsTitles.STATUS,
        GoogleAnalyticsEventsValues.CLOSE,
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

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.DASHBOARD,
        AnalyticsEvents.SIDE_MENU,
        `${item} Selected`,
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.MENU,
        GoogleAnalyticsEventsTitles.SELECTION,
        `${item}`,
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

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.APP_UPDATE_BADGE,
        'Modal',
        'New version modal displayed',
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.APP_UPDATE,
        GoogleAnalyticsEventsTitles.STATUS,
        GoogleAnalyticsEventsValues.OPEN
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

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.APP_UPDATE_BADGE,
        'Modal',
        `${selected} button selected`,
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.APP_UPDATE,
        GoogleAnalyticsEventsTitles.STATUS,
        '${selected}'
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

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.APP_UPDATE_BADGE,
        'New version badge selected',
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.APP_UPDATE,
        GoogleAnalyticsEventsTitles.STATUS,
        GoogleAnalyticsEventsValues.CLICKED
      );
      return of(AnalyticRecorded());
    }),
  ));

  detectDeviceTheme$ = createEffect(() => this.actions$.pipe(
    ofType(DetectDeviceTheme),
    switchMap(() => {

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.METADATA,
        'Device theme',
        isDeviceThemeDarkMode() ? 'Dark mode' : 'Light mode',
      );

      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.METADATA,
        GoogleAnalyticsEventsTitles.DEVICE_THEME,
        isDeviceThemeDarkMode() ?
          GoogleAnalyticsEventsValues.DARK_MODE : GoogleAnalyticsEventsValues.LIGHT_MODE,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
