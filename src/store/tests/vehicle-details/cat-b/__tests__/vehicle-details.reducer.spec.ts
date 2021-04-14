import { vehicleDetailsReducer } from '../vehicle-details.cat-b.reducer';
import {
  VehicleRegistrationChanged,
  SchoolCarToggled,
  DualControlsToggled,
  GearboxCategoryChanged,
} from '../../vehicle-details.actions';

describe('vehicle details reducer', () => {
  it('should put the registration number into the state on vehicle registration changed action', () => {
    const result = vehicleDetailsReducer({}, VehicleRegistrationChanged('abc123'));
    expect(result.registrationNumber).toBe('abc123');
  });

  it('should toggle the state of school car when school car toggled action is received', () => {
    let result;
    result = vehicleDetailsReducer({}, SchoolCarToggled());
    expect(result.schoolCar).toBe(true);
    result = vehicleDetailsReducer(result, SchoolCarToggled());
    expect(result.schoolCar).toBe(false);
  });

  it('should toggle the state of dual controls when dual controls toggled action is received', () => {
    let result;
    result = vehicleDetailsReducer({}, DualControlsToggled());
    expect(result.dualControls).toBe(true);
    result = vehicleDetailsReducer(result, DualControlsToggled());
    expect(result.dualControls).toBe(false);
  });

  it('should change the gearbox category when the gearbox change action is received', () => {
    const result = vehicleDetailsReducer({}, GearboxCategoryChanged('Automatic'));
    expect(result.gearboxCategory).toBe('Automatic');
  });

});
