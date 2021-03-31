import { vehicleDetailsReducer } from '../vehicle-details.reducer';
import {
  VehicleRegistrationChanged,
  GearboxCategoryChanged,
} from '../vehicle-details.actions';

describe('vehicle details reducer', () => {
  it('should put the registration number into the state on vehicle registration changed action', () => {
    const result = vehicleDetailsReducer({}, new VehicleRegistrationChanged('abc123'));
    expect(result.registrationNumber).toBe('abc123');
  });

  it('should change the gearbox category when the gearbox change action is received', () => {
    const result = vehicleDetailsReducer({}, new GearboxCategoryChanged('Automatic'));
    expect(result.gearboxCategory).toBe('Automatic');
  });

});
