import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';
import { vehicleDetailsCatCReducer } from '@store/tests/vehicle-details/cat-c/vehicle-details.cat-c.reducer';
import * as vehicleDetailsActions from '../../vehicle-details.actions';

describe('vehicleDetailsCatDReducer', () => {
  describe('VehicleRegistrationChanged', () => {
    it('should set registrationNumber to the value given', () => {
      const result = vehicleDetailsCatCReducer(
        { registrationNumber: null },
        vehicleDetailsActions.VehicleRegistrationChanged('test')
      );
      expect(result).toEqual({ registrationNumber: 'test' });
    });
  });
  describe('MotStatusChanged', () => {
    it('should set motStatus to the value given', () => {
      const result = vehicleDetailsCatCReducer(
        { motStatus: null },
        vehicleDetailsActions.MotStatusChanged(MotStatusCodes.NO_DETAILS)
      );
      expect(result).toEqual({ motStatus: MotStatusCodes.NO_DETAILS });
    });
  });
  describe('GearboxCategoryChanged', () => {
    it('should set gearboxCategory to the value given', () => {
      const result = vehicleDetailsCatCReducer(
        { gearboxCategory: null },
        vehicleDetailsActions.GearboxCategoryChanged('Manual')
      );
      expect(result).toEqual({ gearboxCategory: 'Manual' });
    });
  });
  describe('ClearGearboxCategory', () => {
    it('should set gearboxCategory to null', () => {
      const result = vehicleDetailsCatCReducer(
        { gearboxCategory: 'Manual' },
        vehicleDetailsActions.ClearGearboxCategory()
      );
      expect(result).toEqual({ gearboxCategory: null });
    });
  });
  describe('PopulateVehicleDimensions', () => {
    it('should set vehicleLength and vehicleWidth to the values given', () => {
      const result: CatCUniqueTypes.VehicleDetails = vehicleDetailsCatCReducer(
        { vehicleWidth: null, vehicleLength: null } as CatCUniqueTypes.VehicleDetails,
        vehicleDetailsActions.PopulateVehicleDimensions(1, 2)
      );
      expect(result).toEqual({ vehicleWidth: 1, vehicleLength: 2 });
    });
  });
});
