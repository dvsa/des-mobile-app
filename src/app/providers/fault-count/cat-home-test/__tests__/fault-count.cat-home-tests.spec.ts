import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { FaultCountHomeTestHelper } from '../fault-count.cat-home-test';

import {
  vehicleChecksTwoFaults,
  catFTestDataStateObject,
  catFTestDataVCStateObject,
} from '../../__mocks__/cat-F-test-data-state-object';
import { catGTestDataStateObject, catGTestDataVCStateObject } from '../../__mocks__/cat-G-test-data-state-object';
import { catHTestDataStateObject, catHTestDataVCStateObject } from '../../__mocks__/cat-H-test-data-state-object';
import { catKTestDataStateObject, catKTestDataVCStateObject } from '../../__mocks__/cat-K-test-data-state-object';

describe('FaultCountHomeTestHelper', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
    });
  });

  describe('getManoeuvreCountIfAny', () => {
    const manouevreTests = [
      {
        category: 'F', data: catFTestDataStateObject, expectedDF: 1, expectedS: 0, expectedD: 0,
      },
      {
        category: 'G', data: catGTestDataStateObject, expectedDF: 0, expectedS: 1, expectedD: 0,
      },
      {
        category: 'H', data: catHTestDataStateObject, expectedDF: 0, expectedS: 0, expectedD: 1,
      },
      {
        category: 'K', data: catKTestDataStateObject, expectedDF: 0, expectedS: 0, expectedD: 0,
      },
    ];

    manouevreTests.forEach((test) => {
      it(`should return ${test.expectedDF} driving fault count for category ${test.category} manoeuvres`, () => {
        const result = FaultCountHomeTestHelper.getManoeuvreCountIfAny(test.data, CompetencyOutcome.DF);
        expect(result).toEqual(test.expectedDF);
      });
    });
    manouevreTests.forEach((test) => {
      it(`should return ${test.expectedS} serious fault count for category ${test.category} manoeuvres`, () => {
        const result = FaultCountHomeTestHelper.getManoeuvreCountIfAny(test.data, CompetencyOutcome.S);
        expect(result).toEqual(test.expectedS);
      });
    });
    manouevreTests.forEach((test) => {
      it(`should return ${test.expectedD} dangerous fault count for category ${test.category} manoeuvres`, () => {
        const result = FaultCountHomeTestHelper.getManoeuvreCountIfAny(test.data, CompetencyOutcome.D);
        expect(result).toEqual(test.expectedD);
      });
    });

  });
  describe('getDrivingFaultSumCountCatHomeTest (No VehicleChecks)', () => {
    const drivingFaultTests = [
      { category: 'F', data: catFTestDataStateObject, expected: 4 },
      { category: 'G', data: catGTestDataStateObject, expected: 5 },
      { category: 'H', data: catHTestDataStateObject, expected: 0 },
      { category: 'K', data: catKTestDataStateObject, expected: 4 },
    ];
    drivingFaultTests.forEach((test) => {
      it(`should return ${test.expected} driving fault count for category ${test.category}`, () => {
        const result = FaultCountHomeTestHelper.getDrivingFaultSumCountCatHomeTest(test.data);
        expect(result).toEqual(test.expected);
      });
    });
  });

  describe('getDrivingFaultSumCountCatHomeTest (Including VehicleChecks)', () => {
    const drivingFaultTests = [
      { category: 'F', data: catFTestDataVCStateObject, expected: 3 },
      { category: 'G', data: catGTestDataVCStateObject, expected: 6 },
      { category: 'H', data: catHTestDataVCStateObject, expected: 1 },
      { category: 'K', data: catKTestDataVCStateObject, expected: 5 },
    ];
    drivingFaultTests.forEach((test) => {
      it(`should return ${test.expected} driving fault count for category ${test.category}`, () => {
        const result = FaultCountHomeTestHelper.getDrivingFaultSumCountCatHomeTest(test.data);
        expect(result).toEqual(test.expected);
      });
    });

  });

  describe('getSeriousFaultSumCountCatHomeTest', () => {
    const seriousFaultTests = [
      { category: 'F', data: catFTestDataStateObject, expected: 2 },
      { category: 'G', data: catGTestDataStateObject, expected: 6 },
      { category: 'H', data: catHTestDataStateObject, expected: 2 },
      { category: 'K', data: catKTestDataStateObject, expected: 0 },
    ];
    seriousFaultTests.forEach((test) => {
      it(`should return ${test.expected} Serious fault count for category ${test.category}`, () => {
        const result = FaultCountHomeTestHelper.getSeriousFaultSumCountHomeTest(test.data);
        expect(result).toEqual(test.expected);
      });
    });

  });
  describe('getDangerousFaultSumCountCatHomeTest', () => {
    const dangerousFaultTests = [
      { category: 'F', data: catFTestDataStateObject, expected: 2 },
      { category: 'G', data: catGTestDataStateObject, expected: 5 },
      { category: 'H', data: catHTestDataStateObject, expected: 2 },
      { category: 'K', data: catKTestDataStateObject, expected: 0 },
    ];
    dangerousFaultTests.forEach((test) => {
      it(`should return ${test.expected} Dangerous fault count for category ${test.category}`, () => {
        const result = FaultCountHomeTestHelper.getDangerousFaultSumCountHomeTest(test.data);
        expect(result).toEqual(test.expected);
      });
    });
  });

  describe('getVehicleChecksFaultCountCatHomeTest', () => {
    it('2 driving faults result in 1 driving fault', () => {
      expect((FaultCountHomeTestHelper as any)
        .getVehicleChecksFaultCountCatHomeTest(vehicleChecksTwoFaults).drivingFaults).toEqual(1);
      expect((FaultCountHomeTestHelper as any)
        .getVehicleChecksFaultCountCatHomeTest(vehicleChecksTwoFaults).seriousFaults).toEqual(0);
    });
  });
});
