import { vehicleDetailsCatDReducer } from '@store/tests/vehicle-details/cat-d/vehicle-details.cat-d.reducer';
import { MotDetails } from '@providers/mot-details/mot-details.model';
import * as vehicleDetailsActions from '../../vehicle-details.actions';

describe('vehicleDetailsCatDReducer', () => {
  describe('VehicleRegistrationChanged', () => {
    it('should set registrationNumber to the value given', () => {
      const result = vehicleDetailsCatDReducer(
        { registrationNumber: null }, vehicleDetailsActions.VehicleRegistrationChanged('test'),
      );
      expect(result)
        .toEqual({ registrationNumber: 'test' });
    });
  });
  describe('MotDataChanged', () => {
    it('should set motStatus to the value given', () => {
      const result = vehicleDetailsCatDReducer(
        { motStatus: null },
        vehicleDetailsActions.MotDataChanged({
          status: 'testData',
          make: 'make',
          model: 'mod',
          testExpiryDate: 'tst',
        } as MotDetails),
      );
      expect(result.motStatus)
        .toEqual('testData');
    });
  });
  describe('GearboxCategoryChanged', () => {
    it('should set gearboxCategory to the value given', () => {
      const result = vehicleDetailsCatDReducer(
        { gearboxCategory: null }, vehicleDetailsActions.GearboxCategoryChanged('Manual'),
      );
      expect(result)
        .toEqual({ gearboxCategory: 'Manual' });
    });
  });
  describe('ClearGearboxCategory', () => {
    it('should set gearboxCategory to null', () => {
      const result = vehicleDetailsCatDReducer(
        { gearboxCategory: 'Manual' }, vehicleDetailsActions.ClearGearboxCategory(),
      );
      expect(result)
        .toEqual({ gearboxCategory: null });
    });
  });
  describe('PopulateVehicleDimensions', () => {
    it('should set vehicleLength and vehicleWidth to the values given', () => {
      const result = vehicleDetailsCatDReducer(
        {
          vehicleWidth: null,
          vehicleLength: null,
        }, vehicleDetailsActions.PopulateVehicleDimensions(1, 2),
      );
      expect(result)
        .toEqual({
          vehicleWidth: 1,
          vehicleLength: 2,
        });
    });
  });
});
