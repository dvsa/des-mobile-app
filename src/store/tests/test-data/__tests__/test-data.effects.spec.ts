import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ReplaySubject } from 'rxjs';

import * as testsActions from '../../tests.actions';
import { testsReducer } from '../../tests.reducer';
import * as drivingFaultsActions from '../common/driving-faults/driving-faults.actions';
import { Competencies } from '../test-data.constants';
import { TestDataEffects } from '../test-data.effects';
import { FaultPayload } from '../test-data.models';

describe('TestDataEffects', () => {
  let effects: TestDataEffects;
  let actions$: ReplaySubject<any>;
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
    it('should dispatch an action to add driving fault', (done) => {
      const faultPayload: FaultPayload = {
        competency: Competencies.ancillaryControls,
        newFaultCount: 1,
      };
      const throttleAddDrivingFault = drivingFaultsActions.ThrottleAddDrivingFault(faultPayload);
      // ARRANGE - setup the store
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(throttleAddDrivingFault);
      // ACT - replay the action for the effect
      actions$.next(throttleAddDrivingFault);
      // ASSERT
      effects.throttleAddDrivingFaultEffect$.subscribe((result) => {
        expect(result).toEqual(drivingFaultsActions.AddDrivingFault(faultPayload));
        done();
      });
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
