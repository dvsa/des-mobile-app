import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import * as testStatusActions from '@store/tests/test-status/test-status.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as testActions from '@store/tests/tests.actions';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as officeActions from '../office.actions';
import { OfficeEffects } from '../office.effects';

describe('OfficeEffects', () => {
  let effects: OfficeEffects;
  let actions$: ReplaySubject<Action>;
  const currentSlotId = '1234';

  beforeEach(() => {
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
  });

  describe('additionalInformationChanged effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(testSummaryActions.AdditionalInformationChanged('xyz'));
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('candidateDescriptionChanged effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(testSummaryActions.CandidateDescriptionChanged('xyz'));
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('routeNumberChanged effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(testSummaryActions.RouteNumberChanged(14));
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('debriefWitnessedChanged effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(testSummaryActions.DebriefWitnessed());
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('debriefUnWitnessedChanged effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(testSummaryActions.DebriefUnWitnessed());
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('identificationUsedChanged effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(testSummaryActions.IdentificationUsedChanged('Licence'));
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('independentDrivingTypeChanged effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(testSummaryActions.IndependentDrivingTypeChanged('Sat nav'));
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('d255Yes effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(testSummaryActions.D255Yes());
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('d255No effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(testSummaryActions.D255No());
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('weatherConditionsChanged effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(testSummaryActions.WeatherConditionsChanged(['Icy']));
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('AddDangerousFaultComment effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(AddDangerousFaultComment(Competencies.controlsParkingBrake, 'xyz'));
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('AddSeriousFaultComment effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(AddSeriousFaultComment(Competencies.controlsParkingBrake, 'abc'));
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
    });
  });

  describe('AddDrivingFaultComment effect', () => {
    it('should invoke the PersistTest action', async () => {
      actions$.next(AddDrivingFaultComment(Competencies.controlsParkingBrake, 'def'));
      const result = await firstValueFrom(effects.persistOfficeDataEffect$);
      expect(result.type === testActions.PersistTests.type).toBe(true);
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
