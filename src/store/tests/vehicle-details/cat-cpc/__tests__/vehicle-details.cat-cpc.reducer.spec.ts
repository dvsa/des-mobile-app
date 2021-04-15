import {
  VehicleRegistrationChanged,
  GearboxCategoryChanged,
  ClearGearboxCategory,
  PopulateVehicleConfiguration,
} from '../../vehicle-details.actions';
import { vehicleDetailsCatCPCReducer } from '../vehicle-details.cat-cpc.reducer';

describe('vehicleDetailsCatCPCReducer', () => {
  it('should put the registration number into the state on vehicle registration changed action', () => {
    const result = vehicleDetailsCatCPCReducer({}, VehicleRegistrationChanged('abc123'));
    expect(result.registrationNumber).toEqual('abc123');
  });
  it('should change the gearbox category when the gearbox change action is received', () => {
    const result = vehicleDetailsCatCPCReducer({}, GearboxCategoryChanged('Automatic'));
    expect(result.gearboxCategory).toEqual('Automatic');
  });
  it('should change set the gearboxCategory back to null', () => {
    const result = vehicleDetailsCatCPCReducer({}, ClearGearboxCategory());
    expect(result.gearboxCategory).toEqual(null);
  });
  it('should change set the gearboxCategory back to null', () => {
    const result = vehicleDetailsCatCPCReducer({}, ClearGearboxCategory());
    expect(result.gearboxCategory).toEqual(null);
  });
  it('should change set the confiuration to the value passed in as the payload', () => {
    const result = vehicleDetailsCatCPCReducer({}, PopulateVehicleConfiguration('Articulated'));
    expect(result.configuration).toEqual('Articulated');
  });
});
