import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import {
  catchError, concatMap, filter, map, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { StoreModel } from '@shared/models/store.model';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { LogHelper } from '@providers/logs/logs-helper';
import { VehicleDetailsApiService } from '@providers/vehicle-details-api/vehicle-details-api.service';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import {
  GetMotStatus, GetMotStatusFailure,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { MotStatusChanged } from '@store/tests/vehicle-details/vehicle-details.actions';

export enum MotStatus {
  NO_DETAILS = 'No details found',
}

@Injectable()
export class WaitingRoomToCarEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private vehicleDetailsApiProvider: VehicleDetailsApiService,
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
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, isPracticeTest]) => (
      this.platform.is('cordova')
            && !isPracticeTest
            && this.networkStateProvider.getNetworkState() === ConnectionStatus.ONLINE
    )),
    // above filter means we will not call through to candidate service when any of the above conditions fail.
    switchMap(([{ identifier }]) => this.vehicleDetailsApiProvider.getVehicleByIdentifier(identifier)),
    map((vehicleDetails) => MotStatusChanged(vehicleDetails?.vehicle?.motStatus || MotStatus.NO_DETAILS)),
    catchError((err) => {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'Error retrieving MOT status', err.error),
      }));
      return of(GetMotStatusFailure());
    }),
  ));

}
