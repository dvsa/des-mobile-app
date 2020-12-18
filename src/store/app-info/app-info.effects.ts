/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  switchMap, concatMap, map, catchError, withLatestFrom, filter,
} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { StoreModel } from '../../types/store.model';
import { AppInfoProvider } from '../../app/providers/app-info/app-info';
import { DateTimeProvider } from '../../app/providers/date-time/date-time';
import { AuthenticationProvider } from '../../app/providers/authentication/authentication';
import {
  AppResumed,
  LoadAppInfo,
  LoadAppInfoFailure,
  LoadAppInfoSuccess,
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
  ) {}

  loadAppInfo$ = createEffect(() => this.actions$.pipe(
    ofType(LoadAppInfo.type),
    switchMap(() => this.appInfoProvider.getVersionNumber()
      .pipe(
        map((versionNumber: string) => LoadAppInfoSuccess({ versionNumber })),
        catchError((err: HttpErrorResponse) => {
          return of(LoadAppInfoFailure(err));
        }),
      )),
  ));

  loadConfigSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType(LoadConfigSuccess.type),
    switchMap(() => of(SetDateConfigLoaded({ refreshDate: this.dateTimeProvider.now().format('YYYY-MM-DD') }))),
  ));

  appResumedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(AppResumed.type),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.select(selectDateConfigLoaded),
      ),
    )),
    filter(([, dateConfigLoaded]) => dateConfigLoaded !== this.dateTimeProvider.now().format('YYYY-MM-DD')),
    switchMap(([action, dateConfigLoaded]) => {
      this.router.navigate(['login']);
      return of(RestartApp());
    }),
  ));

  loadEmployeeName$ = createEffect(() => this.actions$.pipe(
    ofType(LoadEmployeeName.type),
    switchMap(async () => {
      const employeeName = await this.authenticationProvider.loadEmployeeName();
      return LoadEmployeeNameSuccess({ employeeName });
    }),
  ));
}
