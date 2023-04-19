import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StoreModel } from '@shared/models/store.model';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { IonicModule } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { testsReducer } from '@store/tests/tests.reducer';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { StartTest } from '@store/tests/tests.actions';
import {
  AddEmergencyStopSeriousFault,
  RecordEmergencyStopFirstAttempt,
  RecordEmergencyStopSecondAttempt, RemoveEmergencyStopSeriousFault,
} from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.actions';
import {
  AddAvoidanceSeriousFault,
  RecordAvoidanceFirstAttempt,
  RecordAvoidanceSecondAttempt, RemoveAvoidanceSeriousFault,
} from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { Subscription } from 'rxjs';
import { CompetencyButtonComponent } from '../../../../components/competency-button/competency-button';
import { SpeedCheckComponent } from '../speed-check';
import { testReportReducer } from '../../../../test-report.reducer';
import { SingleFaultCompetencyComponent } from '../../../../components/single-fault-competency/single-fault-competency';
import {
  mockBlankSpeed,
  mockInvalidSpeed,
  mockValidSpeed,
} from './speed-check.mock';

describe('SpeedCheckComponent', () => {
  let fixture: ComponentFixture<SpeedCheckComponent>;
  let component: SpeedCheckComponent;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpeedCheckComponent,
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DangerousFaultBadgeComponent),
        MockComponent(CompetencyButtonComponent),
        MockComponent(SingleFaultCompetencyComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({ tests: testsReducer, testReport: testReportReducer }),
      ],
    });

    fixture = TestBed.createComponent(SpeedCheckComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.EUAM1));
  }));

  describe('Class', () => {
    describe('toggleNotMet function dispatching right actions', () => {
      it('should dispatch AddEmergencyStopSeriousFault when Emergency Stop is the speed check', () => {
        component.competency = Competencies.speedCheckEmergency;
        component.outcome = null;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.toggleNotMet();
        expect(storeDispatchSpy).toHaveBeenCalledWith(AddEmergencyStopSeriousFault());
      });
      it('should dispatch RemoveEmergencyStopSeriousFault when '
          + 'Emergency Stop is the speed check and outcome is "S"', () => {
        component.competency = Competencies.speedCheckEmergency;
        component.outcome = CompetencyOutcome.S;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.toggleNotMet();
        expect(storeDispatchSpy).toHaveBeenCalledWith(RemoveEmergencyStopSeriousFault());
      });

      it('should dispatch AddAvoidanceSeriousFault when Avoidance is the speed check', () => {
        component.competency = Competencies.speedCheckAvoidance;
        component.outcome = null;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.toggleNotMet();
        expect(storeDispatchSpy).toHaveBeenCalledWith(AddAvoidanceSeriousFault());
      });
      it('should dispatch RemoveAvoidanceSeriousFault when Avoidance is the speed check and outcome is "S"', () => {
        component.competency = Competencies.speedCheckAvoidance;
        component.outcome = CompetencyOutcome.S;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.toggleNotMet();
        expect(storeDispatchSpy).toHaveBeenCalledWith(RemoveAvoidanceSeriousFault());
      });
    });

    describe('getFirstAttempt returning correct speed attempt', () => {
      it('should return null when no firstAttempt is set', () => {
        const result = component.getFirstAttempt();
        expect(result).toBeNull();
      });

      it('should return the speed attempt that has been set', () => {
        const attemptedSpeed = 49;
        component.firstAttempt = attemptedSpeed;
        const result = component.getFirstAttempt();
        expect(result).toBe(attemptedSpeed);
      });
    });

    describe('getSecondAttempt returning correct speed attempt', () => {
      it('should return null when no secondAttempt is set', () => {
        const result = component.getSecondAttempt();
        expect(result).toBeNull();
      });

      it('should return the speed attempt that has been set', () => {
        const attemptedSpeed = 49;
        component.secondAttempt = attemptedSpeed;
        const result = component.getSecondAttempt();
        expect(result).toBe(attemptedSpeed);
      });
    });

    describe('ngOnDestroy', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(component.subscription.unsubscribe)
          .toHaveBeenCalled();
      });
    });

    describe('ngOnInit', () => {
      it('should setup subscription if merged is present', () => {
        component.ngOnInit();

        expect(component.subscription).toBeDefined();
      });
    });

    describe('getLabel', () => {
      it('should return true if outcome is S', () => {
        component.competency = Competencies.ancillaryControls;
        expect(component.getLabel()).toEqual('Ancillary controls');
      });
    });

    describe('getNotMet', () => {
      it('should return true if outcome is S', () => {
        component.outcome = CompetencyOutcome.S;
        expect(component.getNotMet()).toEqual(true);
      });
      it('should return true if outcome is not S', () => {
        component.outcome = null;
        expect(component.getNotMet()).toEqual(false);
      });
    });

    describe('onFirstAttemptChange dispatches the correct actions', () => {
      it('should record emergency stop first attempt', () => {
        component.competency = Competencies.speedCheckEmergency;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        const attemptedSpeed = {
          target: {
            value: '48',
          },
        };
        component.onFirstAttemptChange(attemptedSpeed);
        expect(storeDispatchSpy).toHaveBeenCalledWith(RecordEmergencyStopFirstAttempt(Number('48')));
      });

      it('should record avoidance first attempt', () => {
        component.competency = Competencies.speedCheckAvoidance;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        const attemptedSpeed = {
          target: {
            value: '48',
          },
        };
        component.onFirstAttemptChange(attemptedSpeed);
        expect(storeDispatchSpy).toHaveBeenCalledWith(RecordAvoidanceFirstAttempt(Number('48')));
      });

      it('should record undefined as Emergency Stop firstAttempt when attemptedSpeed is an empty string', () => {
        component.competency = Competencies.speedCheckEmergency;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        const attemptedSpeed = {
          target: {
            value: '',
          },
        };
        component.onFirstAttemptChange(attemptedSpeed);
        expect(storeDispatchSpy).toHaveBeenCalledWith(RecordEmergencyStopFirstAttempt(undefined));
      });

      it('should record undefined as Avoidance firstAttempt when attemptedSpeed is an empty string', () => {
        component.competency = Competencies.speedCheckAvoidance;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        const attemptedSpeed = {
          target: {
            value: '',
          },
        };
        component.onFirstAttemptChange(attemptedSpeed);
        expect(storeDispatchSpy).toHaveBeenCalledWith(RecordAvoidanceFirstAttempt(undefined));
      });
    });

    describe('onSecondAttemptChange', () => {
      it('should record emergency stop second attempt', () => {
        component.competency = Competencies.speedCheckEmergency;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        const attemptedSpeed = {
          target: {
            value: '48',
          },
        };
        component.onSecondAttemptChange(attemptedSpeed);
        expect(storeDispatchSpy).toHaveBeenCalledWith(RecordEmergencyStopSecondAttempt(Number('48')));
      });

      it('should record avoidance second attempt', () => {
        component.competency = Competencies.speedCheckAvoidance;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        const attemptedSpeed = {
          target: {
            value: '48',
          },
        };
        component.onSecondAttemptChange(attemptedSpeed);
        expect(storeDispatchSpy).toHaveBeenCalledWith(RecordAvoidanceSecondAttempt(Number('48')));
      });

      it('should record undefined as Emergency Stop secondAttempt when attemptedSpeed is an empty string', () => {
        component.competency = Competencies.speedCheckEmergency;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        const attemptedSpeed = {
          target: {
            value: '',
          },
        };
        component.onSecondAttemptChange(attemptedSpeed);
        expect(storeDispatchSpy).toHaveBeenCalledWith(RecordEmergencyStopSecondAttempt(undefined));
      });

      it('should record undefined as Avoidance secondAttempt when attemptedSpeed is an empty string', () => {
        component.competency = Competencies.speedCheckAvoidance;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        const attemptedSpeed = {
          target: {
            value: '',
          },
        };
        component.onSecondAttemptChange(attemptedSpeed);
        expect(storeDispatchSpy).toHaveBeenCalledWith(RecordAvoidanceSecondAttempt(undefined));
      });
    });
  });

  describe('firstAttemptValid', () => {
    it('should return false if first attempt is null', () => {
      component.firstAttempt = null;
      expect(component.firstAttemptValid()).toEqual(false);
    });
    it('should return true if the first attempt is 0', () => {
      component.firstAttempt = 0;
      expect(component.firstAttemptValid()).toEqual(true);
    });
    it('should return false if the first attempt is undefined', () => {
      component.firstAttempt = undefined;
      expect(component.firstAttemptValid()).toEqual(false);
    });
    it('should return true if the first attempt is a positive number', () => {
      component.firstAttempt = 25;
      expect(component.firstAttemptValid()).toEqual(true);
    });
  });

  describe('formatSpeedAttempt', () => {
    it('should detect valid pattern and cast to number', () => {
      expect(component.formatSpeedAttempt(mockValidSpeed)).toEqual(123);
    });
    it('should detect invalid pattern, strip characters and cast to number', () => {
      expect(component.formatSpeedAttempt(mockInvalidSpeed)).toEqual(145);
    });
    it('should return undefined as could cast empty string to a number', () => {
      expect(component.formatSpeedAttempt(mockBlankSpeed)).toEqual(undefined);
    });
  });
});
