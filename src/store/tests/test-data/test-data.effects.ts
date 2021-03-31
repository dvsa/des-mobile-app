// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { withLatestFrom, concatMap, switchMap, throttleTime } from 'rxjs/operators';
// import * as drivingFaultsActions from './common/driving-faults/driving-faults.actions';
// import * as ecoActions from './common/eco/eco.actions';
// import { of } from 'rxjs';
// import { StoreModel } from '../../../shared/models/store.model';
// import { Store, select } from '@ngrx/store';
// import { getTests } from './../tests.reducer';
// import { getCurrentTest } from './../tests.selector';
// import { Eco } from '@dvsa/mes-test-schema/categories/common';
// import { getTestData } from './cat-b/test-data.reducer';
// import { getEco } from './common/test-data.selector';
//
// @Injectable()
// export class TestDataEffects {
//   constructor(
//     private actions$: Actions,
//     private store$: Store<StoreModel>,
//   ) {}
//
//   @Effect()
//   throttleAddDrivingFaultEffect$ = this.actions$.pipe(
//     ofType(
//       drivingFaultsActions.THROTTLE_ADD_DRIVING_FAULT,
//     ),
//     throttleTime(250),
//     concatMap((action: drivingFaultsActions.ThrottleAddDrivingFault) => {
//       return of(new drivingFaultsActions.AddDrivingFault(action.payload));
//     }),
//   );
//
//   @Effect()
//   setEcoControlCompletedEffect$ = this.actions$.pipe(
//     ofType(
//       ecoActions.TOGGLE_CONTROL_ECO,
//     ),
//     concatMap(action => of(action).pipe(
//       withLatestFrom(
//         this.store$.pipe(
//           select(getTests),
//           select(getCurrentTest),
//           select(getTestData),
//           select(getEco),
//         ),
//       ),
//     )),
//     switchMap(([action, eco]: [ecoActions.ToggleControlEco, Eco]) => {
//       if (eco.adviceGivenControl && !eco.completed) {
//         return of(new ecoActions.ToggleEco());
//       }
//       return of();
//     }),
//   );
//
//   @Effect()
//   setEcoPlanningCompletedEffect$ = this.actions$.pipe(
//     ofType(
//       ecoActions.TOGGLE_PLANNING_ECO,
//     ),
//     concatMap(action => of(action).pipe(
//       withLatestFrom(
//         this.store$.pipe(
//           select(getTests),
//           select(getCurrentTest),
//           select(getTestData),
//           select(getEco),
//         ),
//       ),
//     )),
//     switchMap(([action, eco]: [ecoActions.TogglePlanningEco, Eco]) => {
//       if (eco.adviceGivenPlanning && !eco.completed) {
//         return of(new ecoActions.ToggleEco());
//       }
//       return of();
//     }),
//   );
//
// }
