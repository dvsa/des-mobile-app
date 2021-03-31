import { TestDataEffects } from '../test-data.effects';
import { ReplaySubject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import * as drivingFaultsActions from '../common/driving-faults/driving-faults.actions';
import * as ecoActions from '../common/eco/eco.actions';
import * as testsActions from '../../tests.actions';
import { testsReducer } from '../../tests.reducer';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '../../../../shared/models/store.model';
import { Competencies } from '../test-data.constants';
import { FaultPayload } from '../test-data.models';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';

describe('Test Data Effects', () => {

  let effects: TestDataEffects;
  let actions$: any;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        TestDataEffects,
        provideMockActions(() => actions$),
        Store,
      ],
    });
  });

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    effects = TestBed.get(TestDataEffects);
    store$ = TestBed.get(Store);
  });

  describe('throttleAddDrivingFaultEffect', () => {
    it('should dispatch an action to add driving fault', (done) => {
      const faultPayload: FaultPayload = {
        competency: Competencies.ancillaryControls,
        newFaultCount: 1,
      };
      const throttleAddDrivingFault = new drivingFaultsActions.ThrottleAddDrivingFault(faultPayload);
      // ARRANGE - setup the store
      store$.dispatch(new testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(throttleAddDrivingFault);
      // ACT - replay the action for the effect
      actions$.next(throttleAddDrivingFault);
      // ASSERT
      effects.throttleAddDrivingFaultEffect$.subscribe((result) => {
        expect(result).toEqual(new drivingFaultsActions.AddDrivingFault(faultPayload));
        done();
      });
    });
  });

  describe('setEcoControlCompletedEffect', () => {
    it('should dispatch an action to toggle eco to be completed', (done) => {
      const toggleControlEcoAction = new ecoActions.ToggleControlEco();
      // ARRANGE - setup the store
      store$.dispatch(new testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(toggleControlEcoAction);
      // ACT - replay the action for the effect
      actions$.next(toggleControlEcoAction);
      // ASSERT
      effects.setEcoControlCompletedEffect$.subscribe((result) => {
        expect(result).toEqual(new ecoActions.ToggleEco());
        done();
      });
    });
  });

  describe('setEcoPlanningCompletedEffect', () => {
    it('should dispatch an action to toggle eco to be completed', (done) => {
      const togglePlanningEcoAction = new ecoActions.TogglePlanningEco();
      // ARRANGE - setup the store
      store$.dispatch(new testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(togglePlanningEcoAction);
      // ACT - replay the action for the effect
      actions$.next(togglePlanningEcoAction);
      // ASSERT
      effects.setEcoPlanningCompletedEffect$.subscribe((result) => {
        expect(result).toEqual(new ecoActions.ToggleEco());
        done();
      });
    });
  });

});
