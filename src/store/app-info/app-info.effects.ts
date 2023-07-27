import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError, concatMap, filter, map, switchMap, withLatestFrom,
} from 'rxjs/operators';
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
  RestartApp,
  SetDateConfigLoaded,
} from './app-info.actions';
import { selectDateConfigLoaded } from './app-info.selectors';

@Injectable()
export class AppInfoEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store$: Store<StoreModel>,
    private appInfoProvider: AppInfoProvider,
    private dateTimeProvider: DateTimeProvider,
    private authenticationProvider: AuthenticationProvider,
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
    filter(([, dateConfigLoaded]) => dateConfigLoaded !== this.dateTimeProvider.now()
      .format('YYYY-MM-DD')),
    switchMap(() => {
      console.log('App resumed after being suspended. Config was not loaded today... app will refresh');
      this.router.navigate([LOGIN_PAGE]);
      return of(RestartApp());
    }),
  ));

  loadEmployeeName$ = createEffect(() => this.actions$.pipe(
    ofType(LoadEmployeeName),
    switchMap(async () => {
      const employeeName = await this.authenticationProvider.loadEmployeeName();
      return LoadEmployeeNameSuccess({ employeeName });
    }),
  ));
}
