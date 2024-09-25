import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { vehicleDetailsCatDReducer } from '@store/tests/vehicle-details/cat-d/vehicle-details.cat-d.reducer';
import * as vehicleDetailsActions from '../../vehicle-details.actions';
import {MotStatusCodes} from '@providers/mot-history-api/mot-interfaces';

describe('vehicleDetailsCatDReducer', () => {
  describe('VehicleRegistrationChanged', () => {
    it('should set registrationNumber to the value given', () => {
      const result = vehicleDetailsCatDReducer(
        { registrationNumber: null },
        vehicleDetailsActions.VehicleRegistrationChanged('test')
      );
      expect(result).toEqual({ registrationNumber: 'test' });
    });
  });
  describe('MotStatusChanged', () => {
    it('should set motStatus to the value given', () => {
      const result = vehicleDetailsCatDReducer({ motStatus: null }, vehicleDetailsActions.MotStatusChanged(MotStatusCodes.NO_DETAILS));
      expect(result).toEqual({ motStatus: MotStatusCodes.NO_DETAILS });
    });
  });
  describe('GearboxCategoryChanged', () => {
    it('should set gearboxCategory to the value given', () => {
      const result = vehicleDetailsCatDReducer(
        { gearboxCategory: null },
        vehicleDetailsActions.GearboxCategoryChanged('Manual')
      );
      expect(result).toEqual({ gearboxCategory: 'Manual' });
    });
  });
  describe('ClearGearboxCategory', () => {
    it('should set gearboxCategory to null', () => {
      const result = vehicleDetailsCatDReducer(
        { gearboxCategory: 'Manual' },
        vehicleDetailsActions.ClearGearboxCategory()
      );
      expect(result).toEqual({ gearboxCategory: null });
    });
  });
  describe('PopulateVehicleDimensions', () => {
    it('should set vehicleLength and vehicleWidth to the values given', () => {
      const result: CatDUniqueTypes.VehicleDetails = vehicleDetailsCatDReducer(
        { vehicleWidth: null, vehicleLength: null } as CatDUniqueTypes.VehicleDetails,
        vehicleDetailsActions.PopulateVehicleDimensions(1, 2)
      );
      expect(result).toEqual({ vehicleWidth: 1, vehicleLength: 2 });
    });
  });
});
