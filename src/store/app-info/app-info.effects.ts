import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, concatMap, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { AppInfoProvider } from '@providers/app-info/app-info';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { LOGIN_PAGE } from '@pages/page-names.constants';
import { StoreModel } from '@shared/models/store.model';
import {
  AppResumed,
  HasSeenUpdateAvailablePopup,
  LoadAppVersion,
  LoadAppVersionFailure,
  LoadAppVersionSuccess,
  LoadConfigSuccess,
  LoadEmployeeName,
  LoadEmployeeNameSuccess,
  LoadExaminerStatsFailure,
  LoadExaminerStatsPreferences,
  RestartApp,
  SetDateConfigLoaded,
} from './app-info.actions';
import { selectDateConfigLoaded, selectExaminerStats } from './app-info.selectors';
import { DetectDeviceTheme } from '@pages/dashboard/dashboard.actions';
import {
  ColourFilterChanged,
  DateRangeChanged,
  HideChartsChanged,
  LocationChanged,
  TestCategoryChanged,
} from '@pages/examiner-stats/examiner-stats.actions';
import { DataStoreProvider } from '@providers/data-store/data-store';

@Injectable()
export class AppInfoEffects {
  private static readonly EXAMINER_STATS_KEY: string = 'EXAMINER_STAT_PREFERENCES';

  constructor(
    private actions$: Actions,
    private router: Router,
    private store$: Store<StoreModel>,
    private appInfoProvider: AppInfoProvider,
    private dateTimeProvider: DateTimeProvider,
    private authenticationProvider: AuthenticationProvider,
    private dataStore: DataStoreProvider,
  ) {
  }

  loadAppInfo$ = createEffect(() => this.actions$.pipe(
    ofType(LoadAppVersion),
    switchMap(() => this.appInfoProvider.getVersionNumber()
      .pipe(
        map((versionNumber: string) => LoadAppVersionSuccess({ versionNumber })),
        catchError((err: HttpErrorResponse) => of(LoadAppVersionFailure(err))),
      )),
  ));

  loadConfigSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType(LoadConfigSuccess),
    switchMap(() => of(SetDateConfigLoaded({
      refreshDate: this.dateTimeProvider.now()
        .format('YYYY-MM-DD'),
    }))),
  ));

  dateConfigLoaded$ = createEffect(() => this.actions$.pipe(
    ofType(SetDateConfigLoaded),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.select(selectDateConfigLoaded),
        ),
      )),
    filter((
      [, dateConfigLoaded],
    ) => dateConfigLoaded !== this.dateTimeProvider.now()
      .format('YYYY-MM-DD')),
    map(() => HasSeenUpdateAvailablePopup(false)),
  ));

  appResumedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(AppResumed),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.select(selectDateConfigLoaded),
        ),
      )),
    filter((
      [, dateConfigLoaded],
    ) => dateConfigLoaded !== this.dateTimeProvider.now()
      .format('YYYY-MM-DD')),
    concatMap(() => this.router.navigate([LOGIN_PAGE])),
    switchMap(() => {
      console.log('App resumed after being suspended. Config was not loaded today... app will refresh');
      return [
        RestartApp(),
        DetectDeviceTheme(),
      ];
    }),
  ));

  loadEmployeeName$ = createEffect(() => this.actions$.pipe(
    ofType(LoadEmployeeName),
    switchMap(async () => {
      const employeeName = await this.authenticationProvider.loadEmployeeName();
      return LoadEmployeeNameSuccess({ employeeName });
    }),
  ));

  persistExaminerStatsPreferences$ = createEffect(() => this.actions$.pipe(
    ofType(
      ColourFilterChanged,
      HideChartsChanged,
      TestCategoryChanged,
      DateRangeChanged,
      LocationChanged,
    ),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.select(selectExaminerStats),
        ),
      )),
    switchMap(async (
      [, examinerStatPreferences],
    ) => this.dataStore.setItem(AppInfoEffects.EXAMINER_STATS_KEY, JSON.stringify(examinerStatPreferences))),
  ), { dispatch: false });

  loadExaminerStatsPreferences$ = createEffect(() => this.actions$.pipe(
    ofType(LoadExaminerStatsPreferences),
    concatMap(() => this.dataStore.getItem(AppInfoEffects.EXAMINER_STATS_KEY)),
    switchMap((examinerStats) => {
      if (!examinerStats) {
        return [LoadExaminerStatsFailure('Examiner stats preferences not found')];
      }
      const {
        hideCharts,
        colourScheme,
        dateFilter,
        locationFilter,
        categoryFilter,
      } = JSON.parse(examinerStats);

      return [
        (!!colourScheme) ? ColourFilterChanged(colourScheme) : null,
        (!!hideCharts) ? HideChartsChanged(hideCharts) : null,
        (!!dateFilter) ? DateRangeChanged(dateFilter) : null,
        (!!locationFilter) ? LocationChanged(locationFilter) : null,
        (!!categoryFilter) ? TestCategoryChanged(categoryFilter) : null,
      ];
    }),
  ));
}
