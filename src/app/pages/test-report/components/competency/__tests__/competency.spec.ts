import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Store, StoreModule } from '@ngrx/store';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { StoreModel } from '@shared/models/store.model';
import {
  AddDangerousFault,
  RemoveDangerousFault,
} from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import {
  AddDrivingFault,
  RemoveDrivingFault,
  ThrottleAddDrivingFault,
} from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import {
  AddSeriousFault,
  RemoveSeriousFault,
} from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { MockComponent } from 'ng-mocks';

import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../../test-report.actions';
import { testReportReducer } from '../../../test-report.reducer';
import { CompetencyButtonComponent } from '../../competency-button/competency-button';
import { CompetencyComponent } from '../competency';

describe('CompetencyComponent', () => {
  let fixture: ComponentFixture<CompetencyComponent>;
  let component: CompetencyComponent;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
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
        CompetencyComponent,
        MockComponent(CompetencyButtonComponent),
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DangerousFaultBadgeComponent),
      ],
      providers: [{ provide: DateTimeProvider, useClass: DateTimeProviderMock }],
    });

    fixture = TestBed.createComponent(CompetencyComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
  });

  describe('Class', () => {
    describe('getLabel', () => {
      it('should get the correct label for a competency', () => {
        component.competency = Competencies.controlsSteering;
        expect(component.getLabel()).toBe('Steering');
      });
      it('should get the correct label for a competency with an overridden label', () => {
        component.competency = Competencies.controlsSteering;
        component.labelOverride = Competencies.signalsTimed;
        expect(component.getLabel()).toBe('Timed');
      });
    });

    describe('addDrivingFault', () => {
      it('should dispatch a THROTTLE_ADD_DRIVING_FAULT action for press', () => {
        component.competency = Competencies.controlsSteering;

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(
          ThrottleAddDrivingFault({
            competency: component.competency,
            newFaultCount: 1,
          })
        );
      });
      it('should not dispatch an ADD_DRIVING_FAULT action for tap', () => {
        component.competency = Competencies.controlsSteering;

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          AddDrivingFault({
            competency: component.competency,
            newFaultCount: 1,
          })
        );
      });
      it('should not dispatch an ADD_DRIVING_FAULT action if there is a serious fault', () => {
        component.competency = Competencies.awarenessPlanning;
        vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          AddDrivingFault({
            competency: component.competency,
            newFaultCount: 1,
          })
        );
      });
      it('should not dispatch an ADD_DRIVING_FAULT action if serious mode is active', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          AddDrivingFault({
            competency: component.competency,
            newFaultCount: 1,
          })
        );
      });
      it('should not dispatch an ADD_DRIVING_FAULT action if there is a dangerous fault', () => {
        component.competency = Competencies.awarenessPlanning;
        vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          AddDrivingFault({
            competency: component.competency,
            newFaultCount: 1,
          })
        );
      });
      it('should not dispatch an ADD_DRIVING_FAULT action if dangerous mode is active', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          AddDrivingFault({
            competency: component.competency,
            newFaultCount: 1,
          })
        );
      });
    });

    describe('addDangerousFault', () => {
      it('should dispatch a ADD_DANGEROUS_FAULT action if dangerous mode is active on press', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(AddDangerousFault(component.competency));
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
      });
      it('should dispatch a ADD_DANGEROUS_FAULT action if dangerous mode is active on press and hold', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(AddDangerousFault(component.competency));
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
      });
      it('should not dispatch a ADD_DANGEROUS_FAULT action if there is a dangerous fault', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(AddDangerousFault(component.competency));
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleDangerousFaultMode());
      });
    });

    describe('addSeriousFault', () => {
      it('should dispatch an ADD_SERIOUS_FAULT action if serious mode is active', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(AddSeriousFault(component.competency));
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode());
      });
      it('should not dispatch a ADD_SERIOUS_FAULT action if there is a serious fault', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(AddSeriousFault(component.competency));
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleSeriousFaultMode());
      });
      it('should not dispatch a ADD_SERIOUS_FAULT action if dangerous mode is active', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(AddSeriousFault(component.competency));
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleSeriousFaultMode());
      });
      it('should not dispatch a ADD_SERIOUS_FAULT action if there is a dangerous fault', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(AddSeriousFault(component.competency));
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleSeriousFaultMode());
      });
    });

    describe('removeDrivingFault', () => {
      it('should dispatch a REMOVE_DRIVING_FAULT', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'faultCount', 'get').mockReturnValue(1);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(
          RemoveDrivingFault({
            competency: component.competency,
            newFaultCount: 0,
          })
        );
      });
      it('should not dispatch a REMOVE_DRIVING_FAULT when limit is zero', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'faultCount', 'get').mockReturnValue(0);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          RemoveDrivingFault({
            competency: component.competency,
            newFaultCount: 0,
          })
        );
      });
      it('should NOT remove driving fault when serious mode is active', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'faultCount', 'get').mockReturnValue(1);
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          RemoveDrivingFault({
            competency: component.competency,
            newFaultCount: 1,
          })
        );
      });
      it('should NOT remove driving fault when dangerous mode is active', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'faultCount', 'get').mockReturnValue(1);
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          RemoveDrivingFault({
            competency: component.competency,
            newFaultCount: 1,
          })
        );
      });
    });

    describe('removeSeriousFault', () => {
      it('should not dispatch a REMOVE_SERIOUS_FAULT when not in remove mode', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(false);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(RemoveSeriousFault(component.competency));
      });
      it('should dispatch a REMOVE_SERIOUS_FAULT for press and hold', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(RemoveSeriousFault(component.competency));
      });
      it('should dispatch a REMOVE_SERIOUS_FAULT for press', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(RemoveSeriousFault(component.competency));
      });
      it('should not dispatch a REMOVE_SERIOUS_FAULT when is dangerous mode', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(RemoveSeriousFault(component.competency));
      });

      it('should not remove serious mode after removal attempt on competency with no serious fault', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(false);
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleSeriousFaultMode());
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleRemoveFaultMode());
        fixture.detectChanges();
      });
    });

    describe('removeDangerousFault', () => {
      it('should not dispatch a REMOVE_DANGEROUS_FAULT when not in remove mode', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(false);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(RemoveDangerousFault(component.competency));
      });
      it('should dispatch a REMOVE_DANGEROUS_FAULT for press and hold', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(RemoveDangerousFault(component.competency));
      });
      it('should dispatch a REMOVE_DANGEROUS_FAULT for press', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(RemoveDangerousFault(component.competency));
      });
      it('should not dispatch a REMOVE_DANGEROUS_FAULT when is serious mode', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(RemoveDangerousFault(component.competency));
      });
      it('should not remove dangerous mode after removal attempt on competency with no dangerous fault', () => {
        component.competency = Competencies.controlsSteering;
        vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(false);
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);
        vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleDangerousFaultMode());
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ToggleRemoveFaultMode());
        fixture.detectChanges();
      });
    });

    describe('buttonClick', () => {
      it('should dispatch ADD_DANGEROUS_FAULT action if dangerous mode is active', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(AddDangerousFault(component.competency));
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
      });

      it('should dispatch ADD_SERIOUS_FAULT action if serious mode is active', () => {
        component.competency = Competencies.clearance;
        vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);

        const storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(AddSeriousFault(component.competency));
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode());
      });
    });
  });

  describe('canButtonRipple', () => {
    it('should allow ripple when in remove dangerous mode and there is a dangerous fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(true);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should not allow ripple when in remove dangerous mode and there is not a dangerous fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(false);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should allow ripple when in remove serious mode and there is a serious fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(true);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should not allow ripple when in remove serious mode and there is not a serious fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(false);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should allow ripple when in remove fault mode and there is a driving fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'faultCount', 'get').mockReturnValue(1);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should not allow ripple when in remove fault mode and there is not a driving fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'faultCount', 'get').mockReturnValue(0);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should not allow ripple when in remove fault mode and driving fault is undefined', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(true);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should not allow ripple when in add dangerous mode and there is a dangerous fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(false);
      vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(true);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should allow ripple when in add dangerous mode and there is not a dangerous fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(false);
      vi.spyOn(component, 'isDangerousMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(false);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should not allow ripple when in add serious mode and there is a serious fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(false);
      vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(true);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(false);
    });

    it('should allow ripple when in add serious mode and there is not a serious fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(false);
      vi.spyOn(component, 'isSeriousMode', 'get').mockReturnValue(true);
      vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(false);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should allow ripple when in add fault mode and there is a driving fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(false);
      vi.spyOn(component, 'faultCount', 'get').mockReturnValue(1);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should allow ripple when in add fault mode and there is not a driving fault', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(false);
      vi.spyOn(component, 'faultCount', 'get').mockReturnValue(0);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });

    it('should allow ripple when in add fault mode and driving fault is undefined', () => {
      vi.spyOn(component, 'isRemoveFaultMode', 'get').mockReturnValue(false);

      component.canButtonRipple();
      expect(component.allowRipple).toEqual(true);
    });
  });

  describe('competencyHasFault', () => {
    it('should return true if competency has a driving fault', () => {
      vi.spyOn(component, 'faultCount', 'get').mockReturnValue(1);

      expect(component.competencyHasFault()).toBe(true);
    });
    it('should return true if competency has a serious fault', () => {
      vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(true);

      expect(component.competencyHasFault()).toBe(true);
    });
    it('should return true if competency has a dangerous fault', () => {
      vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(true);

      expect(component.competencyHasFault()).toBe(true);
    });
    it('should return false if competency does not have a fault', () => {
      vi.spyOn(component, 'faultCount', 'get').mockReturnValue(undefined);
      vi.spyOn(component, 'hasDangerousFault', 'get').mockReturnValue(false);
      vi.spyOn(component, 'hasSeriousFault', 'get').mockReturnValue(false);

      expect(component.competencyHasFault()).toBe(false);
    });
  });

  describe('hasDrivingFault', () => {
    it('should return true if faultCount is not undefined', () => {
      vi.spyOn(component, 'faultCount', 'get').mockReturnValue(1);
      expect(component.hasDrivingFault()).toBe(true);
    });
    it('should return false if faultCount is undefined', () => {
      vi.spyOn(component, 'faultCount', 'get').mockReturnValue(undefined);
      expect(component.hasDrivingFault()).toBe(false);
    });
  });
});
