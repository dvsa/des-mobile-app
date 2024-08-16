import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import * as testStatusActions from '@store/tests/test-status/test-status.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as testActions from '@store/tests/tests.actions';
import { ReplaySubject } from 'rxjs';
import * as officeActions from '../office.actions';
import { OfficeEffects } from '../office.effects';

describe('OfficeEffects', () => {
  let effects: OfficeEffects;
  let actions$: ReplaySubject<any>;
  const currentSlotId = '1234';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: currentSlotId,
            },
            testStatus: {},
            startedTests: {},
          }),
        }),
      ],
      providers: [OfficeEffects, provideMockActions(() => actions$), Store],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(OfficeEffects);
  }));

  describe('additionalInformationChanged effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(testSummaryActions.AdditionalInformationChanged('xyz'));
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('candidateDescriptionChanged effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(testSummaryActions.CandidateDescriptionChanged('xyz'));
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('routeNumberChanged effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(testSummaryActions.RouteNumberChanged(14));
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('debriefWitnessedChanged effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(testSummaryActions.DebriefWitnessed());
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('debriefUnWitnessedChanged effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(testSummaryActions.DebriefUnWitnessed());
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('identificationUsedChanged effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(testSummaryActions.IdentificationUsedChanged('Licence'));
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('independentDrivingTypeChanged effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(testSummaryActions.IndependentDrivingTypeChanged('Sat nav'));
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('d255Yes effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(testSummaryActions.D255Yes());
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('d255No effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(testSummaryActions.D255No());
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('weatherConditionsChanged effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(testSummaryActions.WeatherConditionsChanged(['Icy']));
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('AddDangerousFaultComment effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(AddDangerousFaultComment(Competencies.controlsParkingBrake, 'xyz'));
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('AddSeriousFaultComment effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(AddSeriousFaultComment(Competencies.controlsParkingBrake, 'abc'));
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('AddDrivingFaultComment effect', () => {
    it('should invoke the PersistTest action', (done) => {
      // ACT
      actions$.next(AddDrivingFaultComment(Competencies.controlsParkingBrake, 'def'));
      // ASSERT
      effects.persistOfficeDataEffect$.subscribe((result) => {
        expect(result.type === testActions.PersistTests.type).toBe(true);
        done();
      });
    });
  });

  describe('submitWaitingRoomInfoEffect', () => {
    it('should return SET_STATUS_DECIDED & PERSIST_TESTS actions', () => {
      actions$.next(officeActions.CompleteTest());
      effects.completeTestEffect$.subscribe((result) => {
        if (result.type === testStatusActions.SetTestStatusCompleted.type) {
          expect(result.type).toEqual(testStatusActions.SetTestStatusCompleted(currentSlotId).type);
        }
        if (result.type === testActions.PersistTests.type) {
          expect(result.type).toEqual(testActions.PersistTests().type);
        }
      });
    });
  });
});
