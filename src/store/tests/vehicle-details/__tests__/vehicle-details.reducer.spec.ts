import { MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';
import {
  ClearGearboxCategory,
  GearboxCategoryChanged,
  MotEvidenceChanged,
  MotEvidenceProvidedToggled,
  MotStatusChanged,
  VRNListUpdated,
  VehicleExpiryDateChanged,
  VehicleMakeChanged,
  VehicleModelChanged,
  VehicleRegistrationChanged,
} from '../vehicle-details.actions';
import { vehicleDetailsReducer } from '../vehicle-details.reducer';

describe('vehicle details reducer', () => {
  it('should put the mot evidence into the state on MotEvidenceChanged action', () => {
    const result = vehicleDetailsReducer({}, MotEvidenceChanged('abc123'));
    expect(result.motEvidence).toBe('abc123');
  });

  it('should put the mot evidence provided value into the state on MotEvidenceProvidedToggled action', () => {
    const result = vehicleDetailsReducer({}, MotEvidenceProvidedToggled(true));
    expect(result.motEvidenceProvided).toBe(true);
  });

  it('should put the vehicle make into the state on VehicleMakeChanged action', () => {
    const result = vehicleDetailsReducer({}, VehicleMakeChanged('abc123'));
    expect(result.make).toBe('abc123');
  });

  it('should put the vehicle model into the state on VehicleModelChanged action', () => {
    const result = vehicleDetailsReducer({}, VehicleModelChanged('abc123'));
    expect(result.model).toBe('abc123');
  });

  it('should put the mot expiry date into the state on VehicleExpiryDateChanged action', () => {
    const result = vehicleDetailsReducer({}, VehicleExpiryDateChanged('abc123'));
    expect(result.testExpiryDate).toBe('abc123');
  });

  it(
    'should create the previously searched VRNs array and put ' +
      'it into the state on VRNListUpdated action and the array is null',
    () => {
      const result = vehicleDetailsReducer({}, VRNListUpdated('abc123'));
      expect(result.previouslySearchedRegNumbers).toEqual(['abc123']);
    }
  );
  it(
    'should append the previously searched VRNs array and put ' +
      'it into the state on VRNListUpdated action and the array is not null',
    () => {
      const result = vehicleDetailsReducer({ previouslySearchedRegNumbers: ['1'] }, VRNListUpdated('abc123'));
      expect(result.previouslySearchedRegNumbers).toEqual(['1', 'abc123']);
    }
  );

  it('should clear the gearbox category on ClearGearboxCategory action', () => {
    const result = vehicleDetailsReducer({ gearboxCategory: 'Manual' }, ClearGearboxCategory());
    expect(result.gearboxCategory).toEqual(null);
  });

  it('should put the registration number into the state on vehicle registration changed action', () => {
    const result = vehicleDetailsReducer({}, VehicleRegistrationChanged('abc123'));
    expect(result.registrationNumber).toBe('abc123');
  });
  it('should change the gearbox category when the gearbox change action is received', () => {
    const result = vehicleDetailsReducer({}, GearboxCategoryChanged('Automatic'));
    expect(result.gearboxCategory).toBe('Automatic');
  });
  it('should change the mot status when the mot change action is received', () => {
    const result = vehicleDetailsReducer({}, MotStatusChanged(MotStatusCodes.NO_DETAILS));
    expect(result.motStatus).toBe(MotStatusCodes.NO_DETAILS);
  });
});
