import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { AppInfoProvider } from '../../app/providers/app-info/app-info';
import { DateTimeProvider } from '../../app/providers/date-time/date-time';
import { AuthenticationProvider } from '../../app/providers/authentication/authentication';
import {
  LoadAppInfo,
  LoadAppInfoFailure,
  LoadAppInfoSuccess,
  LoadConfigSuccess,
  LoadEmployeeName,
  LoadEmployeeNameSuccess,
  SetDateConfigLoaded,
} from './app-info.actions';

@Injectable()
export class AppInfoEffects {

  constructor(
    private actions$: Actions,
    private appInfoProvider: AppInfoProvider,
    private dateTimeProvider: DateTimeProvider,
    private authenticationProvider: AuthenticationProvider,
  ) {}

  loadAppInfo$ = createEffect(() => this.actions$.pipe(
    ofType(LoadAppInfo.type),
    switchMap(() => this.appInfoProvider.getVersionNumber()
      .pipe(
        map((versionNumber: string) => LoadAppInfoSuccess({ versionNumber })),
        catchError((err: HttpErrorResponse) => of(LoadAppInfoFailure(err))),
      )),
  ));

  loadConfigSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType(LoadConfigSuccess.type),
    switchMap(() => of(SetDateConfigLoaded({ refreshDate: this.dateTimeProvider.now().format('YYYY-MM-DD') }))),
  ));

  loadEmployeeName$ = createEffect(() => this.actions$.pipe(
    ofType(LoadEmployeeName.type),
    switchMap(async () => {
      const employeeName = await this.authenticationProvider.loadEmployeeName();
      return LoadEmployeeNameSuccess({ employeeName });
    }),
  ));
}
