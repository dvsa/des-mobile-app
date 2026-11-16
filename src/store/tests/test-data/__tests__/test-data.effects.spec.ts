import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import * as testsActions from '../../tests.actions';
import { testsReducer } from '../../tests.reducer';
import * as drivingFaultsActions from '../common/driving-faults/driving-faults.actions';
import { Competencies } from '../test-data.constants';
import { TestDataEffects } from '../test-data.effects';
import { FaultPayload } from '../test-data.models';

describe('TestDataEffects', () => {
  let effects: TestDataEffects;
  let actions$: ReplaySubject<Action>;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [TestDataEffects, provideMockActions(() => actions$), Store],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(TestDataEffects);
    store$ = TestBed.inject(Store);
  });

  describe('throttleAddDrivingFaultEffect', () => {
    it('should dispatch an action to add driving fault', async () => {
      const faultPayload: FaultPayload = {
        competency: Competencies.ancillaryControls,
        newFaultCount: 1,
      };
      const throttleAddDrivingFault = drivingFaultsActions.ThrottleAddDrivingFault(faultPayload);
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(throttleAddDrivingFault);
      actions$.next(throttleAddDrivingFault);
      const result = await firstValueFrom(effects.throttleAddDrivingFaultEffect$);
      expect(result).toEqual(drivingFaultsActions.AddDrivingFault(faultPayload));
    });
  });

  // describe('setEcoControlCompletedEffect', () => {
  //   it('should dispatch an action to toggle eco to be completed', (done) => {
  //     const toggleControlEcoAction = new ecoActions.ToggleControlEco();
  //     // ARRANGE - setup the store
  //     store$.dispatch(new testsActions.StartTest(123456, TestCategory.B));
  //     store$.dispatch(toggleControlEcoAction);
  //     // ACT - replay the action for the effect
  //     actions$.next(toggleControlEcoAction);
  //     // ASSERT
  //     effects.setEcoControlCompletedEffect$.subscribe((result) => {
  //       expect(result).toEqual(new ecoActions.ToggleEco());
  //       done();
  //     });
  //   });
  // });
  //
  // describe('setEcoPlanningCompletedEffect', () => {
  //   it('should dispatch an action to toggle eco to be completed', (done) => {
  //     const togglePlanningEcoAction = new ecoActions.TogglePlanningEco();
  //     // ARRANGE - setup the store
  //     store$.dispatch(new testsActions.StartTest(123456, TestCategory.B));
  //     store$.dispatch(togglePlanningEcoAction);
  //     // ACT - replay the action for the effect
  //     actions$.next(togglePlanningEcoAction);
  //     // ASSERT
  //     effects.setEcoPlanningCompletedEffect$.subscribe((result) => {
  //       expect(result).toEqual(new ecoActions.ToggleEco());
  //       done();
  //     });
  //   });
  // });
});
