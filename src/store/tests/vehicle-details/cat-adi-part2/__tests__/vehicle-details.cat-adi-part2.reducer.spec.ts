import * as vehicleDetailsActions from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  ClearGearboxCategory,
  DualControlsToggled,
  GearboxCategoryChanged,
  SchoolCarToggled,
  VehicleRegistrationChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { MotDetails } from '@providers/mot-details/mot-details.model';
import { initialState, vehicleDetailsCatADIPart2Reducer } from '../vehicle-details.cat-adi-part2.reducer';

describe('vehicleDetailsCatADIPart2Reducer', () => {
  it('should set the registration number when the VehicleRegistrationChanged action is received', () => {
    const result = vehicleDetailsCatADIPart2Reducer(initialState, VehicleRegistrationChanged('testData'));
    expect(result.registrationNumber)
      .toEqual('testData');
  });
  it('should set the mot status when the MotStatusChanged action is received', () => {
    const result = vehicleDetailsCatADIPart2Reducer(
      initialState,
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
  it('should set the gearbox category when the GearboxCategoryChanged action is received', () => {
    const result = vehicleDetailsCatADIPart2Reducer(initialState, GearboxCategoryChanged('Manual'));
    expect(result.gearboxCategory)
      .toEqual('Manual');
  });
  it('should toggle schoolCar when the SchoolCarToggled action is received', () => {
    const result = vehicleDetailsCatADIPart2Reducer(initialState, SchoolCarToggled());
    expect(result.schoolCar)
      .toEqual(true);
  });
  it('should toggle dualControls when the DualControlsToggled action is received', () => {
    const result = vehicleDetailsCatADIPart2Reducer(initialState, DualControlsToggled());
    expect(result.dualControls)
      .toEqual(true);
  });
  it('should clear the gearbox category when the SignatureDataChanged action is received', () => {
    const state: CatADI2UniqueTypes.VehicleDetails = {
      ...initialState,
      gearboxCategory: 'Manual',
    };
    const result = vehicleDetailsCatADIPart2Reducer(state, ClearGearboxCategory());
    expect(result.gearboxCategory)
      .toEqual(null);
  });
});
