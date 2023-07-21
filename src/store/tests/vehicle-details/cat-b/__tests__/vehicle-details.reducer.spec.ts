import { MotDetails } from '@providers/mot-details/mot-details.model';
import { vehicleDetailsReducer } from '../vehicle-details.cat-b.reducer';
import {
  DualControlsToggled,
  GearboxCategoryChanged,
  MotDataChanged,
  SchoolCarToggled,
  VehicleRegistrationChanged,
} from '../../vehicle-details.actions';

describe('vehicleDetailsReducer - Cat B', () => {
  it('should put the registration number into the state on vehicle registration changed action', () => {
    const result = vehicleDetailsReducer({}, VehicleRegistrationChanged('abc123'));
    expect(result.registrationNumber)
      .toBe('abc123');
  });
  it('should toggle the state of school car when school car toggled action is received', () => {
    let result;
    result = vehicleDetailsReducer({}, SchoolCarToggled());
    expect(result.schoolCar)
      .toBe(true);
    result = vehicleDetailsReducer(result, SchoolCarToggled());
    expect(result.schoolCar)
      .toBe(false);
  });
  it('should toggle the state of dual controls when dual controls toggled action is received', () => {
    let result;
    result = vehicleDetailsReducer({}, DualControlsToggled());
    expect(result.dualControls)
      .toBe(true);
    result = vehicleDetailsReducer(result, DualControlsToggled());
    expect(result.dualControls)
      .toBe(false);
  });
  it('should change the gearbox category when the gearbox change action is received', () => {
    const result = vehicleDetailsReducer({}, GearboxCategoryChanged('Automatic'));
    expect(result.gearboxCategory)
      .toBe('Automatic');
  });
  it('should update the relevant MOT fields', () => {
    const result = vehicleDetailsReducer({}, MotDataChanged({
      status: 'Valid',
      make: 'Ford',
      model: 'Fiesta',
      testExpiryDate: '12/12/2007',
    } as MotDetails));
    expect(result.motStatus)
      .toBe('Valid');
    expect(result.make)
      .toBe('Ford');
    expect(result.model)
      .toBe('Fiesta');
    expect(result.testExpiryDate)
      .toBe('12/12/2007');
  });
});
