import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';
import { FaultCountDHelper } from '../fault-count.cat-d';
import { vehicleChecksTwoFaults, vehicleChecksFiveFaults } from '../../__mocks__/cat-D-test-data-state-object';

describe('FaultCountDHelper', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
    });
  });

  describe('getVehicleChecksFaultCountCatD', () => {
    it('5 driving faults result in 1 serious and 4 driving faults', () => {
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatD(vehicleChecksFiveFaults).drivingFaults).toEqual(4);
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatD(vehicleChecksFiveFaults).seriousFaults).toEqual(1);
    });
    it('2 driving faults result in 2 driving faults and no serious', () => {
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatD(vehicleChecksTwoFaults).drivingFaults).toEqual(2);
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatD(vehicleChecksTwoFaults).seriousFaults).toEqual(0);
    });
  });

  describe('getVehicleChecksFaultCountCatD1', () => {
    it('5 driving faults result in 1 serious and 4 driving faults', () => {
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatD1(vehicleChecksFiveFaults).drivingFaults).toEqual(4);
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatD1(vehicleChecksFiveFaults).seriousFaults).toEqual(1);
    });
    it('2 driving faults result in 2 driving faults and no serious', () => {
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatD1(vehicleChecksTwoFaults).drivingFaults).toEqual(2);
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatD1(vehicleChecksTwoFaults).seriousFaults).toEqual(0);
    });
  });

  describe('getVehicleChecksFaultCountCatDE', () => {
    it('2 driving faults result in 1 driving faults and 1 serious', () => {
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatDE(vehicleChecksTwoFaults).drivingFaults).toEqual(1);
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatDE(vehicleChecksTwoFaults).seriousFaults).toEqual(1);
    });
  });

  describe('getVehicleChecksFaultCountCatD1E', () => {
    it('2 driving faults result in 1 driving faults and 1 serious', () => {
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatD1E(vehicleChecksTwoFaults).drivingFaults).toEqual(1);
      expect((FaultCountDHelper as any)
        .getVehicleChecksFaultCountCatD1E(vehicleChecksTwoFaults).seriousFaults).toEqual(1);
    });
  });

});
