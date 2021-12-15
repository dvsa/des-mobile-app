import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { FaultCountAM2Helper } from '../fault-count.cat-a-mod2';
import {
  catAM2TestDataStateObject,
  safetyAndBalanceMock0Faults,
  safetyAndBalanceMock2FaultsSafety,
  safetyAndBalanceMock2FaultsSafetyAndBalance,
  safetyAndBalanceMock3FaultsSafetyAndBalance,
} from '../../__mocks__/cat-AM2-test-data-state-object.mock';

describe('FaultCountAM2Helper', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
    });
  });

  describe('getSafetyAndBalanceFaultCountCatAM2', () => {
    it('0 driving faults', () => {
      const output = { drivingFaults: 0 };
      const temp = FaultCountAM2Helper.getSafetyAndBalanceFaultCountCatAM2(safetyAndBalanceMock0Faults);
      expect(temp).toEqual(output);
    });

    it('1 driving faults, 2 failed safety questions', () => {
      const output = { drivingFaults: 1 };
      const temp = FaultCountAM2Helper.getSafetyAndBalanceFaultCountCatAM2(safetyAndBalanceMock2FaultsSafety);
      expect(temp).toEqual(output);
    });

    it('1 driving faults, 1 failed safety and 1 failed balance question', () => {
      const output = { drivingFaults: 1 };
      const temp = FaultCountAM2Helper.getSafetyAndBalanceFaultCountCatAM2(safetyAndBalanceMock2FaultsSafetyAndBalance);
      expect(temp).toEqual(output);
    });
  });

  it('1 driving fault, 3 failed safety and balance questions', () => {
    const output = { drivingFaults: 1 };
    const temp = FaultCountAM2Helper.getSafetyAndBalanceFaultCountCatAM2(safetyAndBalanceMock3FaultsSafetyAndBalance);
    expect(temp).toEqual(output);
  });

  describe('getDangerousFaultSumCountCatAM2', () => {
    it('should return the dangerous faults count for cat AM2', () => {
      expect(FaultCountAM2Helper.getDangerousFaultSumCountCatAM2(catAM2TestDataStateObject)).toBe(1);
    });
  });

  describe('getSeriousFaultSumCountCatAM2', () => {
    it('should return the serious faults count for cat AM2', () => {
      expect(FaultCountAM2Helper.getSeriousFaultSumCountCatAM2(catAM2TestDataStateObject)).toBe(1);
    });
  });

  describe('getRidingFaultSumCountCatAM2', () => {
    it('should return the driving fault for cat AM2 count correctly', () => {
      expect(FaultCountAM2Helper.getRidingFaultSumCountCatAM2(catAM2TestDataStateObject)).toBe(2);
    });
  });
});
