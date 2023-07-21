import { vehicleDetailsReducer } from '../cat-home-test/vehicle-details.reducer';
import { ClearGearboxCategory, GearboxCategoryChanged, VehicleRegistrationChanged } from '../vehicle-details.actions';

describe('vehicle details reducer', () => {
  it('should put the registration number into the state on vehicle registration changed action', () => {
    const result = vehicleDetailsReducer({}, VehicleRegistrationChanged('abc123'));
    expect(result.registrationNumber)
      .toBe('abc123');
  });
  it('should change the gearbox category when the gearbox change action is received', () => {
    const result = vehicleDetailsReducer({}, GearboxCategoryChanged('Automatic'));
    expect(result.gearboxCategory)
      .toBe('Automatic');
  });
  it('should change the gearbox category to bull when the gearbox clear action is received', () => {
    const result = vehicleDetailsReducer({}, ClearGearboxCategory());
    expect(result.gearboxCategory)
      .toBe(null);
  });
});
