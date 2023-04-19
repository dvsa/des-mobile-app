import {
  vehicleDetailsCatADIPart3Reducer,
} from '@store/tests/vehicle-details/cat-adi-part3/vehicle-details.cat-adi-part3.reducer';
import * as vehicleDetailsActions from '../../vehicle-details.actions';

describe('vehicleDetailsCatADIPart3Reducer', () => {

  describe('VehicleRegistrationChanged', () => {
    it('should set registrationNumber to the value given', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
        { registrationNumber: null }, vehicleDetailsActions.VehicleRegistrationChanged('test'),
      );
      expect(result).toEqual({ registrationNumber: 'test' });
    });
  });
  describe('MotStatusChanged', () => {
    it('should set motStatus to the value given', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
        { motStatus: null }, vehicleDetailsActions.MotStatusChanged('test'),
      );
      expect(result).toEqual({ motStatus: 'test' });
    });
  });
  describe('GearboxCategoryChanged', () => {
    it('should set gearboxCategory to the value given', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
        { gearboxCategory: null }, vehicleDetailsActions.GearboxCategoryChanged('Manual'),
      );
      expect(result).toEqual({ gearboxCategory: 'Manual' });
    });
  });
  describe('ClearGearboxCategory', () => {
    it('should set gearboxCategory to null', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
        { gearboxCategory: 'Manual' }, vehicleDetailsActions.ClearGearboxCategory(),
      );
      expect(result).toEqual({ gearboxCategory: null });
    });
  });
  describe('DualControlsToggledYes', () => {
    it('should set dualControls to true', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
        { dualControls: null }, vehicleDetailsActions.DualControlsToggledYes(),
      );
      expect(result).toEqual({ dualControls: true });
    });
  });

  describe('DualControlsToggledNo', () => {
    it('should set dualControls to false', () => {
      const result = vehicleDetailsCatADIPart3Reducer(
        { dualControls: null }, vehicleDetailsActions.DualControlsToggledNo(),
      );
      expect(result).toEqual({ dualControls: false });
    });
  });
});
