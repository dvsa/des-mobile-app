import {
  vehicleDetailsCatADIPart3Reducer,
} from '@store/tests/vehicle-details/cat-adi-part3/vehicle-details.cat-adi-part3.reducer';
import { MotDetails } from '@providers/mot-details/mot-details.model';
import * as vehicleDetailsActions from '../../vehicle-details.actions';

describe('vehicleDetailsCatADIPart3Reducer', () => {
  describe('VehicleRegistrationChanged', () => {
    it('should set registrationNumber to the value given', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
        { registrationNumber: null }, vehicleDetailsActions.VehicleRegistrationChanged('test'),
      );
      expect(result)
        .toEqual({ registrationNumber: 'test' });
    });
  });
  describe('MotDataChanged', () => {
    it('should set motStatus to the value given', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
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
      const result = vehicleDetailsCatADIPart3Reducer(
        { gearboxCategory: null }, vehicleDetailsActions.GearboxCategoryChanged('Manual'),
      );
      expect(result)
        .toEqual({ gearboxCategory: 'Manual' });
    });
  });
  describe('ClearGearboxCategory', () => {
    it('should set gearboxCategory to null', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
        { gearboxCategory: 'Manual' }, vehicleDetailsActions.ClearGearboxCategory(),
      );
      expect(result)
        .toEqual({ gearboxCategory: null });
    });
  });
  describe('DualControlsToggledYes', () => {
    it('should set dualControls to true', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
        { dualControls: null }, vehicleDetailsActions.DualControlsToggledYes(),
      );
      expect(result)
        .toEqual({ dualControls: true });
    });
  });

  describe('DualControlsToggledNo', () => {
    it('should set dualControls to false', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
        { dualControls: null }, vehicleDetailsActions.DualControlsToggledNo(),
      );
      expect(result)
        .toEqual({ dualControls: false });
    });
  });
});
