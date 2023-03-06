import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError, concatMap, filter, map, switchMap, tap, withLatestFrom,
} from 'rxjs/operators';

import { StoreModel } from '@shared/models/store.model';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { ReferenceDataProvider } from '@providers/reference-data/reference-data';
import {
  GetTestCentresRefData,
  LoadTestCentresRefDataFail,
  LoadTestCentresRefDataSuccess, SetDateRefDataUpdated,
} from '@store/reference-data/reference-data.actions';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { getRefDataState } from '@store/reference-data/reference-data.reducer';
import { getLastUpdatedDate } from '@store/reference-data/reference-data.selector';

@Injectable()
export class ReferenceDataEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private refDataProvider: ReferenceDataProvider,
    private networkStateProvider: NetworkStateProvider,
    private dateTimeProvider: DateTimeProvider,
  ) {}

  testCentreRefData$ = createEffect(() => this.actions$.pipe(
    ofType(GetTestCentresRefData),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getRefDataState),
          map(getLastUpdatedDate),
        ),
      ),
    )),
    // check last updated date is not today & user is in an online state
    filter(([, lastUpdatedDate]) => (
      lastUpdatedDate !== this.dateTimeProvider.now().format('YYYY-MM-DD')
        && this.networkStateProvider.getNetworkState() === ConnectionStatus.ONLINE
    )),
    switchMap(() => this.refDataProvider.getTestCentres()),
    map((data) => LoadTestCentresRefDataSuccess(data)),
    catchError(() => of(LoadTestCentresRefDataFail())),
  ));

  testCentreRefDataSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LoadTestCentresRefDataSuccess),
    switchMap(() => of(
      SetDateRefDataUpdated(this.dateTimeProvider.now().format('YYYY-MM-DD')),
    )),
  ));
}
