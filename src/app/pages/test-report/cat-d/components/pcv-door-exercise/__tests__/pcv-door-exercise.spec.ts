import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { AppModule } from '@app/app.module';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { StoreModel } from '@shared/models/store.model';
import {
  PcvDoorExerciseAddDangerousFault,
  PcvDoorExerciseAddDrivingFault,
  PcvDoorExerciseAddSeriousFault,
  PcvDoorExerciseRemoveDangerousFault,
  PcvDoorExerciseRemoveDrivingFault,
  PcvDoorExerciseRemoveSeriousFault,
} from '@store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise.actions';
import { CompetencyButtonComponent } from '../../../../components/competency-button/competency-button';
import {
  ToggleDangerousFaultMode,
  ToggleRemoveFaultMode,
  ToggleSeriousFaultMode,
} from '../../../../test-report.actions';
import { testReportReducer } from '../../../../test-report.reducer';
import { PcvDoorExerciseComponent } from '../pcv-door-exercise';

describe('PcvDoorExerciseComponent', () => {
  let fixture: ComponentFixture<PcvDoorExerciseComponent>;
  let component: PcvDoorExerciseComponent;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PcvDoorExerciseComponent,
        MockComponent(CompetencyButtonComponent),
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DangerousFaultBadgeComponent),
      ],
      imports: [
        AppModule,
        IonicModule,
        StoreModule.forRoot({
          journal: () => ({
            isLoading: false,
            lastRefreshed: null,
            slots: {},
            selectedDate: '',
            examiner: {
              staffNumber: '1234567',
            },
          }),
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                vehicleDetails: {},
                accompaniment: {},
                testData: {
                  dangerousFaults: {},
                  drivingFaults: {},
                  manoeuvres: {},
                  seriousFaults: {},
                  testRequirements: {},
                  ETA: {},
                  eco: {},
                  vehicleChecks: {
                    showMeQuestion: {
                      code: 'S3',
                      description: '',
                      outcome: '',
                    },
                    tellMeQuestion: {
                      code: '',
                      description: '',
                      outcome: '',
                    },
                  },
                  eyesightTest: {},
                },
                activityCode: '28',
                journalData: {
                  candidate: {
                    candidateName: 'Joe Bloggs',
                    driverNumber: '123',
                  },
                },
                rekey: false,
              },
            },
          }),
          testReport: testReportReducer,
        }),
      ],
      providers: [
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
      ],
    });

    fixture = TestBed.createComponent(PcvDoorExerciseComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
  });

  describe('addOrRemoveFault', () => {
    it('should call removeFault when isRemoveFaultMode is true', () => {
      component.isRemoveFaultMode = true;
      const removeFaultSpy = spyOn(component, 'removeFault');
      const addFaultSpy = spyOn(component, 'addFault');

      component.addOrRemoveFault();

      expect(removeFaultSpy).toHaveBeenCalled();
      expect(addFaultSpy).not.toHaveBeenCalled();
    });

    it('should call addFault when isRemoveFaultMode is false', () => {
      component.isRemoveFaultMode = false;
      const removeFaultSpy = spyOn(component, 'removeFault');
      const addFaultSpy = spyOn(component, 'addFault');

      component.addOrRemoveFault();

      expect(addFaultSpy).toHaveBeenCalledWith(false);
      expect(removeFaultSpy).not.toHaveBeenCalled();
    });

    it('should call addFault with true when wasPress is true', () => {
      component.isRemoveFaultMode = false;
      const addFaultSpy = spyOn(component, 'addFault');

      component.addOrRemoveFault(true);

      expect(addFaultSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('addFault', () => {
    it('should dispatch a THROTTLE_ADD_DRIVING_FAULT action for press', () => {
      component.pcvDoorExercise = { drivingFault: false };
      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(true);
      expect(storeDispatchSpy).toHaveBeenCalledWith(PcvDoorExerciseAddDrivingFault());
    });
    it('should not dispatch an ADD_DRIVING_FAULT action if there is a serious fault', () => {
      component.pcvDoorExercise = { seriousFault: true };
      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(false);

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseAddDrivingFault());
    });
    it('should not dispatch an ADD_DRIVING_FAULT action if serious mode is active', () => {
      component.isSeriousMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(false);

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseAddDrivingFault());
    });
    it('should not dispatch an ADD_DRIVING_FAULT action if there is a dangerous fault', () => {
      component.pcvDoorExercise = { dangerousFault: true };

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(false);

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseAddDrivingFault());
    });
    it('should not dispatch an ADD_DRIVING_FAULT action if dangerous mode is active', () => {
      component.isDangerousMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(false);

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseAddDrivingFault());
    });

    it('should dispatch a ADD_DANGEROUS_FAULT action if dangerous mode is active on press', () => {
      component.isDangerousMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(false);

      expect(storeDispatchSpy).toHaveBeenCalledWith(PcvDoorExerciseAddDangerousFault());
      expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
    });
    it('should not dispatch a ADD_DANGEROUS_FAULT action if there is a dangerous fault', () => {
      component.pcvDoorExercise = { dangerousFault: true };
      component.isDangerousMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(false);

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseAddDangerousFault());
      expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleDangerousFaultMode());
    });

    it('should dispatch an ADD_SERIOUS_FAULT action if serious mode is active', () => {
      component.isSeriousMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(false);

      expect(storeDispatchSpy).toHaveBeenCalledWith(PcvDoorExerciseAddSeriousFault());
      expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode());
    });
    it('should not dispatch a ADD_SERIOUS_FAULT action if there is a serious fault', () => {
      component.pcvDoorExercise = { seriousFault: true };
      component.isSeriousMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(false);

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseAddSeriousFault());
      expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleSeriousFaultMode());
    });
    it('should not dispatch a ADD_SERIOUS_FAULT action if dangerous mode is active', () => {
      component.isDangerousMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(false);

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseAddSeriousFault());
      expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleSeriousFaultMode());
    });
    it('should not dispatch a ADD_SERIOUS_FAULT action if there is a dangerous fault', () => {
      component.pcvDoorExercise = { dangerousFault: true };
      component.isSeriousMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.addFault(false);

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseAddSeriousFault());
      expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleSeriousFaultMode());
    });
  });

  describe('removeFault', () => {
    it('should dispatch a REMOVE_DRIVING_FAULT', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(false);
      spyOn(component, 'hasDrivingFault').and.returnValue(true);
      component.pcvDoorExercise = { drivingFault: true };
      component.isRemoveFaultMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.removeFault();

      expect(storeDispatchSpy).toHaveBeenCalledWith(PcvDoorExerciseRemoveDrivingFault());
    });
    it('should not dispatch a REMOVE_DRIVING_FAULT when no driving fault', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(false);
      spyOn(component, 'hasDrivingFault').and.returnValue(false);
      component.pcvDoorExercise = { dangerousFault: false };
      component.isRemoveFaultMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.removeFault();

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseRemoveDrivingFault());
    });
    it('should NOT remove driving fault when serious mode is active', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(true);
      spyOn(component, 'hasDrivingFault').and.returnValue(false);
      component.pcvDoorExercise = { drivingFault: true };
      component.isSeriousMode = true;
      component.isRemoveFaultMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.removeFault();

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseRemoveDrivingFault());
    });
    it('should NOT remove driving fault when dangerous mode is active', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(false);
      spyOn(component, 'hasDrivingFault').and.returnValue(true);
      component.pcvDoorExercise = { drivingFault: true };
      component.isDangerousMode = true;
      component.isRemoveFaultMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.removeFault();

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseRemoveDrivingFault());
    });

    it('should remove a REMOVE_SERIOUS_FAULT for when one is present and isSeriousMode is active', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(true);
      spyOn(component, 'hasDrivingFault').and.returnValue(false);
      component.pcvDoorExercise = { seriousFault: true };
      component.isSeriousMode = true;
      component.isRemoveFaultMode = true;
      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.removeFault();

      expect(storeDispatchSpy).toHaveBeenCalledWith(PcvDoorExerciseRemoveSeriousFault());
    });

    it('should not remove serious mode after removal attempt on competency with no serious fault', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(false);
      spyOn(component, 'hasDrivingFault').and.returnValue(false);
      component.pcvDoorExercise = { seriousFault: false };
      component.isSeriousMode = true;
      component.isRemoveFaultMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.removeFault();

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleSeriousFaultMode());
      expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleRemoveFaultMode());
    });

    it('should not dispatch a REMOVE_DANGEROUS_FAULT when is serious mode', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(true);
      spyOn(component, 'hasDrivingFault').and.returnValue(false);
      component.pcvDoorExercise = { dangerousFault: true };
      component.isSeriousMode = true;
      component.isRemoveFaultMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.removeFault();

      expect(storeDispatchSpy).not.toHaveBeenCalledWith(PcvDoorExerciseRemoveDangerousFault());
    });

    it('should not remove dangerous mode after removal attempt on competency with no dangerous fault', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(false);
      spyOn(component, 'hasDrivingFault').and.returnValue(false);
      component.pcvDoorExercise = { dangerousFault: false };
      component.isDangerousMode = true;
      component.isRemoveFaultMode = true;

      const storeDispatchSpy = spyOn(store$, 'dispatch');
      component.removeFault();
      expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleDangerousFaultMode());
      expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleRemoveFaultMode());
    });
  });

  describe('canButtonRipple', () => {
    it('should allow ripple when in remove dangerous mode and there is a dangerous fault', () => {
      component.isRemoveFaultMode = true;
      component.isDangerousMode = true;
      component.pcvDoorExercise = { dangerousFault: true };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should not allow ripple when in remove dangerous mode and there is not a dangerous fault', () => {
      component.isRemoveFaultMode = true;
      component.isDangerousMode = true;
      component.pcvDoorExercise = { dangerousFault: false };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should allow ripple when in remove serious mode and there is a serious fault', () => {
      component.isRemoveFaultMode = true;
      component.isSeriousMode = true;
      component.pcvDoorExercise = { seriousFault: true };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should not allow ripple when in remove serious mode and there is not a serious fault', () => {
      component.isRemoveFaultMode = true;
      component.isSeriousMode = true;
      component.pcvDoorExercise = { seriousFault: false };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should allow ripple when in remove fault mode and there is a driving fault', () => {
      component.isRemoveFaultMode = true;
      component.pcvDoorExercise = { drivingFault: true };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should not allow ripple when in remove fault mode and there is not a driving fault', () => {
      component.isRemoveFaultMode = true;
      component.pcvDoorExercise = { drivingFault: false };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should not allow ripple when in remove fault mode and driving fault is undefined', () => {
      component.isRemoveFaultMode = true;

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should not allow ripple when in add dangerous mode and there is a dangerous fault', () => {
      component.isRemoveFaultMode = false;
      component.isDangerousMode = true;
      component.pcvDoorExercise = { dangerousFault: true };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should allow ripple when in add dangerous mode and there is not a dangerous fault', () => {
      component.isRemoveFaultMode = false;
      component.isDangerousMode = true;
      component.pcvDoorExercise = { dangerousFault: false };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should not allow ripple when in add serious mode and there is a serious fault', () => {
      component.isRemoveFaultMode = false;
      component.isSeriousMode = true;
      component.pcvDoorExercise = { seriousFault: true };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should allow ripple when in add serious mode and there is not a serious fault', () => {
      component.isRemoveFaultMode = false;
      component.isSeriousMode = true;
      component.pcvDoorExercise = { seriousFault: false };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should allow ripple when in add fault mode and there is a driving fault', () => {
      component.isRemoveFaultMode = false;
      component.pcvDoorExercise = { drivingFault: true };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should allow ripple when in add fault mode and there is not a driving fault', () => {
      component.isRemoveFaultMode = false;
      component.pcvDoorExercise = { drivingFault: false };

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should allow ripple when in add fault mode and driving fault is undefined', () => {
      component.isRemoveFaultMode = false;

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });
  });

  describe('competencyHasFault', () => {
    it('returns true when there is a dangerous fault', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(true);
      spyOn(component, 'hasSeriousFault').and.returnValue(false);
      spyOn(component, 'hasDrivingFault').and.returnValue(false);

      expect(component.competencyHasFault()).toBe(true);
    });

    it('returns true when there is a serious fault', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(true);
      spyOn(component, 'hasDrivingFault').and.returnValue(false);

      expect(component.competencyHasFault()).toBe(true);
    });

    it('returns true when there is a driving fault', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(false);
      spyOn(component, 'hasDrivingFault').and.returnValue(true);

      expect(component.competencyHasFault()).toBe(true);
    });

    it('returns false when there are no faults', () => {
      spyOn(component, 'hasDangerousFault').and.returnValue(false);
      spyOn(component, 'hasSeriousFault').and.returnValue(false);
      spyOn(component, 'hasDrivingFault').and.returnValue(false);

      expect(component.competencyHasFault()).toBe(false);
    });
  });

  describe('hasDrivingFault', () => {
    it('returns true when drivingFault is true', () => {
      component.pcvDoorExercise = { drivingFault: true };
      expect(component.hasDrivingFault()).toBe(true);
    });

    it('returns false when drivingFault is false', () => {
      component.pcvDoorExercise = { drivingFault: false };
      expect(component.hasDrivingFault()).toBe(false);
    });

    it('returns false when drivingFault is undefined', () => {
      component.pcvDoorExercise = {};
      expect(component.hasDrivingFault()).toBe(false);
    });
  });

  describe('hasSeriousFault', () => {
    it('returns true when seriousFault is true', () => {
      component.pcvDoorExercise = { seriousFault: true };
      expect(component.hasSeriousFault()).toBe(true);
    });

    it('returns false when seriousFault is false', () => {
      component.pcvDoorExercise = { seriousFault: false };
      expect(component.hasSeriousFault()).toBe(false);
    });

    it('returns false when seriousFault is undefined', () => {
      component.pcvDoorExercise = {};
      expect(component.hasSeriousFault()).toBe(false);
    });
  });

  describe('hasDangerousFault', () => {
    it('returns true when dangerousFault is true', () => {
      component.pcvDoorExercise = { dangerousFault: true };
      expect(component.hasDangerousFault()).toBe(true);
    });

    it('returns false when dangerousFault is false', () => {
      component.pcvDoorExercise = { dangerousFault: false };
      expect(component.hasDangerousFault()).toBe(false);
    });

    it('returns false when dangerousFault is undefined', () => {
      component.pcvDoorExercise = {};
      expect(component.hasDangerousFault()).toBe(false);
    });
  });
});
