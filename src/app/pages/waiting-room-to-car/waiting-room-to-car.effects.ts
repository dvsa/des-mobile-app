import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { GetMotStatus, GetMotStatusFailure } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { LogHelper } from '@providers/logs/logs-helper';
import { MotHistoryApiService, MotHistoryWithStatus } from '@providers/mot-history-api/mot-history-api.service';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPracticeMode } from '@store/tests/tests.selector';
import { MotStatusChanged } from '@store/tests/vehicle-details/vehicle-details.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { getRegistrationNumber } from '@store/tests/vehicle-details/vehicle-details.selector';

export enum MotStatus {
  NO_DETAILS = 'No details found',
}

@Injectable()
export class WaitingRoomToCarEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private vehicleDetailsApiProvider: MotHistoryApiService,
    private networkStateProvider: NetworkStateProvider,
    private logHelper: LogHelper,
    private platform: Platform
  ) {}

  getMotStatusData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetMotStatus),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getVehicleDetails),
              select(getRegistrationNumber)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      // above filter means we will not call through to candidate service when any of the above conditions fail.
      filter(
        ([, , isPracticeTest]) =>
          this.platform.is('cordova') &&
          !isPracticeTest &&
          this.networkStateProvider.getNetworkState() === ConnectionStatus.ONLINE
      ),
      // once we are happy user is online and not in a practice test, then we sanitise the input by removing whitespace
      map(([, regNumber]) => regNumber?.replace(/\s/g, '').toUpperCase()),
      // filter any requests that are nulls or empty strings from hitting service
      filter((regNumber) => !!regNumber),
      switchMap((regNumber) => this.vehicleDetailsApiProvider.getMotHistoryByIdentifier(regNumber)),
      map((vehicleDetails: MotHistoryWithStatus) =>
        MotStatusChanged(vehicleDetails?.data?.status || MotStatus.NO_DETAILS)
      ),
      catchError((err) => {
        this.store$.dispatch(
          SaveLog({
            payload: this.logHelper.createLog(
              LogType.ERROR,
              'Error retrieving MOT status',
              err instanceof Error ? err.message : err.error
            ),
          })
        );
        return of(GetMotStatusFailure());
      })
    )
  );
}
