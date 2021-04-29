import { appVersionReducer } from '../app-version.reducer';
import { PopulateAppVersion } from '../app-version.actions';

describe('App version reducer', () => {
  it('should return the app version for a test', () => {
    const mockAppVersion: string = '1.2.1';
    const result = appVersionReducer(null, PopulateAppVersion(mockAppVersion));
    expect(result).toBe(mockAppVersion);
  });
});
