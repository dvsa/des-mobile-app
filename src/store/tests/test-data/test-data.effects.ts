import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import {
  concatMap, throttleTime, withLatestFrom, switchMap, filter,
} from 'rxjs/operators';
import { Eco } from '@dvsa/mes-test-schema/categories/common';
import { StoreModel } from '@shared/models/store.model';

import * as drivingFaultsActions from './common/driving-faults/driving-faults.actions';
import * as ecoActions from './common/eco/eco.actions';
import { getTests } from '../tests.reducer';
import { getCurrentTest } from '../tests.selector';
import { getEco } from './common/test-data.selector';
import { getTestData } from './cat-b/test-data.reducer';

@Injectable()
export class TestDataEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {}

  throttleAddDrivingFaultEffect$ = createEffect(() => this.actions$.pipe(
    ofType(drivingFaultsActions.ThrottleAddDrivingFault),
    throttleTime(250),
    concatMap((action: ReturnType<typeof drivingFaultsActions.ThrottleAddDrivingFault>) => {
      return of(drivingFaultsActions.AddDrivingFault(action.faultPayload));
    }),
  ));

  setEcoControlCompletedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ecoActions.ToggleControlEco),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getTestData),
          select(getEco),
        ),
      ),
    )),
    filter(([action, eco]) => action && eco.adviceGivenControl && !eco.completed),
    switchMap(([,]: [ReturnType<typeof ecoActions.ToggleControlEco>, Eco]) => of(ecoActions.ToggleEco())),
  ));

  setEcoPlanningCompletedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ecoActions.TogglePlanningEco),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getTestData),
          select(getEco),
        ),
      ),
    )),
    filter(([action, eco]) => action && eco.adviceGivenPlanning && !eco.completed),
    switchMap(([,]: [ReturnType<typeof ecoActions.TogglePlanningEco>, Eco]) => of(ecoActions.ToggleEco())),
  ));

}
