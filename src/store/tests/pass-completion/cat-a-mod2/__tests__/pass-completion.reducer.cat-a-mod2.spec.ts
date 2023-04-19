import { passCompletionCatAMod2Reducer, initialState } from '../pass-completion.cat-a-mod2.reducer';
import {
  PassCertificateNumberChanged, ProvisionalLicenseNotReceived, ProvisionalLicenseReceived,
} from '../../pass-completion.actions';

describe('passCompletionCatAMod2Reducer', () => {
  it('should put the pass certificate number into the state on pass certificate number changed action', () => {
    const result = passCompletionCatAMod2Reducer(initialState, PassCertificateNumberChanged('ABC123'));
    expect(result.passCertificateNumber).toBe('ABC123');
  });
  it('should set provisionalLicenceProvided to true on ProvisionalLicenseReceived action', () => {
    const result = passCompletionCatAMod2Reducer(initialState, ProvisionalLicenseReceived());
    expect(result.provisionalLicenceProvided).toBe(true);
  });
  it('should set provisionalLicenceProvided to true on ProvisionalLicenseNotReceived action', () => {
    const result = passCompletionCatAMod2Reducer(initialState, ProvisionalLicenseNotReceived());
    expect(result.provisionalLicenceProvided).toBe(false);
  });
});
