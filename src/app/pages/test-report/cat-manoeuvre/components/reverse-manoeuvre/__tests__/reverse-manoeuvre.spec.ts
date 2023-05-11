import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { Store, StoreModule } from '@ngrx/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppModule } from '@app/app.module';
import { StoreModel } from '@shared/models/store.model';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import {
  AddManoeuvreDangerousFault,
  AddManoeuvreSeriousFault,
  RemoveManoeuvreFault,
} from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import {
  ToggleDangerousFaultMode,
  ToggleRemoveFaultMode,
  ToggleSeriousFaultMode,
} from '@pages/test-report/test-report.actions';
import { ReverseManoeuvreComponent } from '../reverse-manoeuvre';

describe('ReverseManoeuvreComponent', () => {
  let fixture: ComponentFixture<ReverseManoeuvreComponent>;
  let component: ReverseManoeuvreComponent;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReverseManoeuvreComponent,
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
      ],
    });

    fixture = TestBed.createComponent(ReverseManoeuvreComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
  }));

  describe('Class', () => {
    it('should get the competency label from the correct object', () => {
      component.manoeuvre = ManoeuvreTypes.reverseManoeuvre;
      component.competency = ManoeuvreCompetencies.controlFault;
      fixture.detectChanges();
      const expected = 'Control';
      expect(component.label).toEqual(expected);
    });

    describe('hasSeriousFault', () => {
      it('should return false if it does not have a serious fault', () => {
        component.manoeuvre = ManoeuvreTypes.reverseManoeuvre;
        component.competency = ManoeuvreCompetencies.controlFault;
        component.manoeuvreCompetencyOutcome = CompetencyOutcome.DF;

        const result = component.hasSeriousFault();
        expect(result).toBe(false);
      });

      it('should return true if it has a serious fault', () => {
        component.manoeuvre = ManoeuvreTypes.reverseManoeuvre;
        component.competency = ManoeuvreCompetencies.controlFault;
        component.manoeuvreCompetencyOutcome = CompetencyOutcome.S;

        const result = component.hasSeriousFault();
        expect(result).toBe(true);
      });
    });

    describe('hasDangerousFault', () => {
      it('should return false if it does not have a dangerous fault', () => {
        component.manoeuvre = ManoeuvreTypes.reverseManoeuvre;
        component.competency = ManoeuvreCompetencies.controlFault;
        component.manoeuvreCompetencyOutcome = CompetencyOutcome.DF;

        const result = component.hasDangerousFault();
        expect(result).toBe(false);
      });

      it('should return true if it has a dangerous fault', () => {
        component.manoeuvre = ManoeuvreTypes.reverseManoeuvre;
        component.competency = ManoeuvreCompetencies.controlFault;
        component.manoeuvreCompetencyOutcome = CompetencyOutcome.D;

        const result = component.hasDangerousFault();
        expect(result).toBe(true);
      });
    });

    describe('addFault', () => {
      it('should dispatch a ADD_MANOEUVRE_DANGEROUS_FAULT action if dangerous mode is active on press', () => {
        component.manoeuvre = ManoeuvreTypes.reverseManoeuvre;
        component.competency = ManoeuvreCompetencies.controlFault;
        component.isDangerousMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(AddManoeuvreDangerousFault({
          manoeuvre: component.manoeuvre,
          competency: component.competency,
        }));
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
      });

      it('should dispatch a ADD_MANOEUVRE_SERIOUS_FAULT action if serious mode is active on press', () => {
        component.manoeuvre = ManoeuvreTypes.reverseManoeuvre;
        component.competency = ManoeuvreCompetencies.controlFault;
        component.isSeriousMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(AddManoeuvreSeriousFault({
          manoeuvre: component.manoeuvre,
          competency: component.competency,
        }));
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode());
      });
    });

    describe('Remove faults', () => {
      describe('dispatched the actions competency outcome is undefined', () => {
        beforeEach(() => {
          fixture.detectChanges();
          component.manoeuvre = ManoeuvreTypes.reverseManoeuvre;
          component.competency = ManoeuvreCompetencies.controlFault;
          component.isRemoveFaultMode = true;
          component.manoeuvreCompetencyOutcome = undefined;
        });
        it('should only toggle remove and serious fault when remove and serious fault modes are true', () => {
          component.isSeriousMode = true;
          fixture.detectChanges();
          const storeDispatchSpy = spyOn(store$, 'dispatch');
          component.addOrRemoveFault();
          expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
          expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode());
          expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode());
        });
        it('should only toggle remove and serious fault when remove and serious fault modes are true', () => {
          component.isDangerousMode = true;
          fixture.detectChanges();
          const storeDispatchSpy = spyOn(store$, 'dispatch');
          component.addOrRemoveFault();
          expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
          expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode());
          expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
        });
      });
      it('should remove a dangerous fault and toggle dangerous mode when dangerous mode is true', () => {
        fixture.detectChanges();
        component.manoeuvre = ManoeuvreTypes.reverseManoeuvre;
        component.competency = ManoeuvreCompetencies.controlFault;
        component.isRemoveFaultMode = true;
        component.isDangerousMode = true;
        component.manoeuvreCompetencyOutcome = CompetencyOutcome.D;
        fixture.detectChanges();
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).toHaveBeenCalledTimes(3);
        expect(storeDispatchSpy).toHaveBeenCalledWith(RemoveManoeuvreFault({
          competency: component.competency,
          manoeuvre: component.manoeuvre,
        }, CompetencyOutcome.D));
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode());
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
      });
      it('should remove a serious fault and toggle serious mode when serious mode is true', () => {
        fixture.detectChanges();
        component.manoeuvre = ManoeuvreTypes.reverseManoeuvre;
        component.competency = ManoeuvreCompetencies.controlFault;
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.manoeuvreCompetencyOutcome = CompetencyOutcome.S;
        fixture.detectChanges();
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).toHaveBeenCalledTimes(3);
        expect(storeDispatchSpy).toHaveBeenCalledWith(RemoveManoeuvreFault({
          competency: component.competency,
          manoeuvre: component.manoeuvre,
        }, CompetencyOutcome.S));
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode());
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode());
      });
    });
  });
});
