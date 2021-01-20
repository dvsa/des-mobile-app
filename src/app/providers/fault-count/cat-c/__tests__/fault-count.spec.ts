import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';
import { FaultCountCHelper } from '../fault-count.cat-c';
import { vehicleChecksTwoFaults, vehicleChecksFiveFaults } from '../../__mocks__/cat-C-test-data-state-object';

describe('FaultCountCHelper', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
    });
  });

  describe('getVehicleChecksFaultCountCatC', () => {
    it('5 driving faults result in 1 serious and 4 driving faults', () => {
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatC(vehicleChecksFiveFaults).drivingFaults).toEqual(4);
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatC(vehicleChecksFiveFaults).seriousFaults).toEqual(1);
    });
    it('2 driving faults result in 2 driving faults and no serious', () => {
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatC(vehicleChecksTwoFaults).drivingFaults).toEqual(2);
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatC(vehicleChecksTwoFaults).seriousFaults).toEqual(0);
    });
  });

  describe('getVehicleChecksFaultCountCatC1', () => {
    it('5 driving faults result in 1 serious and 4 driving faults', () => {
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatC1(vehicleChecksFiveFaults).drivingFaults).toEqual(4);
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatC1(vehicleChecksFiveFaults).seriousFaults).toEqual(1);
    });
    it('2 driving faults result in 2 driving faults and no serious', () => {
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatC1(vehicleChecksTwoFaults).drivingFaults).toEqual(2);
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatC1(vehicleChecksTwoFaults).seriousFaults).toEqual(0);
    });
  });

  describe('getVehicleChecksFaultCountCatCE', () => {
    it('2 driving faults result in 1 driving faults and 1 serious', () => {
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatCE(vehicleChecksTwoFaults).drivingFaults).toEqual(1);
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatCE(vehicleChecksTwoFaults).seriousFaults).toEqual(1);
    });
  });

  describe('getVehicleChecksFaultCountCatC1E', () => {
    it('2 driving faults result in 1 driving faults and 1 serious', () => {
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatC1E(vehicleChecksTwoFaults).drivingFaults).toEqual(1);
      expect((FaultCountCHelper as any)
        .getVehicleChecksFaultCountCatC1E(vehicleChecksTwoFaults).seriousFaults).toEqual(1);
    });
  });

});
