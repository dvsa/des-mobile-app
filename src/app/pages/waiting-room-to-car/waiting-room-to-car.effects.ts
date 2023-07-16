import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, delay, filter, finalize, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { StoreModel } from '@shared/models/store.model';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { LogHelper } from '@providers/logs/logs-helper';
import { MotDetailsProvider } from '@providers/mot-details/mot-details';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPracticeMode } from '@store/tests/tests.selector';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { GetMotStatus, GetMotStatusFailure } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  ClearMotData,
  MotDataChanged,
  PreviouslySearchedRegChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { getRegistrationNumber } from '@store/tests/vehicle-details/vehicle-details.selector';
import {
  isCheckingMot$,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class WaitingRoomToCarEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private motDetailsProvider: MotDetailsProvider,
    private networkStateProvider: NetworkStateProvider,
    private logHelper: LogHelper,
    private platform: Platform,
  ) {
  }

  getMotStatusData$ = createEffect(() => this.actions$.pipe(
    ofType(GetMotStatus),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getVehicleDetails),
            select(getRegistrationNumber),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    // above filter means we will not call through to candidate service when any of the above conditions fail.
    filter(([, , isPracticeTest]) => this.platform.is('cordova') && !isPracticeTest),
    // once we are happy user is online and not in a practice test, then we sanitise the input by removing whitespace
    map(([, regNumber]) => regNumber?.replace(/\s/g, '')
      .toUpperCase()),
    // filter any requests that are nulls or empty strings from hitting service
    filter((regNumber) => !!regNumber),
    tap(() => isCheckingMot$.next(true)),
    tap((regNumber) => this.store$.dispatch(PreviouslySearchedRegChanged(regNumber))),
    delay(250), //  Add quarter of a second delay so isChecking$ can flip from true to false
    switchMap((regNumber) => this.motDetailsProvider.getVehicleByIdentifier(regNumber)
      .pipe(
        map((motDetails) => MotDataChanged(motDetails)),
        catchError((err: HttpErrorResponse | Error) => {
          let msg: string = JSON.stringify(err);

          if (err instanceof Error) {
            msg = err.message;
          } else if (err instanceof HttpErrorResponse) {
            msg = JSON.stringify(err.error);
          }
          this.store$.dispatch(SaveLog({
            payload: this.logHelper.createLog(LogType.ERROR, 'Error retrieving MOT status', msg),
          }));
          return of(GetMotStatusFailure());
        }),
        finalize(() => isCheckingMot$.next(false)),
      )),
  ));

  getMotStatusFailure$ = createEffect(() => this.actions$.pipe(
    ofType(GetMotStatusFailure),
    map(() => ClearMotData()),
  ));

}
