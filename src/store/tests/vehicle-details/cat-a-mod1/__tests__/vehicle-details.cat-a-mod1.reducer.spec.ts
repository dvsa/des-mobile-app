import {
  vehicleDetailsCatAMod1Reducer,
} from '@store/tests/vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.reducer';
import { MotDetails } from '@providers/mot-details/mot-details.model';
import * as vehicleDetailsActions from '../../vehicle-details.actions';

describe('vehicleDetailsCatAMod1Reducer', () => {
  describe('VehicleRegistrationChanged', () => {
    it('should set registrationNumber to the value given', () => {
      const result = vehicleDetailsCatAMod1Reducer(
        { registrationNumber: null }, vehicleDetailsActions.VehicleRegistrationChanged('test'),
      );
      expect(result)
        .toEqual({ registrationNumber: 'test' });
    });
  });
  describe('MotDataChanged', () => {
    it('should set motStatus to the value given', () => {
      const result = vehicleDetailsCatAMod1Reducer(
        { motStatus: null },
        vehicleDetailsActions.MotDataChanged({
          status: 'test',
          make: 'make',
          model: 'mod',
          testExpiryDate: 'tst',
        } as MotDetails),
      );
      expect(result.motStatus)
        .toEqual('test');
    });
  });
  describe('GearboxCategoryChanged', () => {
    it('should set gearboxCategory to the value given', () => {
      const result = vehicleDetailsCatAMod1Reducer(
        { gearboxCategory: null }, vehicleDetailsActions.GearboxCategoryChanged('Manual'),
      );
      expect(result)
        .toEqual({ gearboxCategory: 'Manual' });
    });
  });
  describe('ClearGearboxCategory', () => {
    it('should set gearboxCategory to null', () => {
      const result = vehicleDetailsCatAMod1Reducer(
        { gearboxCategory: 'Manual' }, vehicleDetailsActions.ClearGearboxCategory(),
      );
      expect(result)
        .toEqual({ gearboxCategory: null });
    });
  });
  describe('PopulateVehicleDimensions', () => {
    it('should toggle schoolBike', () => {
      const result = vehicleDetailsCatAMod1Reducer(
        { schoolBike: true }, vehicleDetailsActions.SchoolBikeToggled(),
      );
      expect(result)
        .toEqual({ schoolBike: false });
    });
  });
});
