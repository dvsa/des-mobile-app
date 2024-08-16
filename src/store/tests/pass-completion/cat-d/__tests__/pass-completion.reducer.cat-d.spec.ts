import {
  Code78NotPresent,
  Code78Present,
  PassCertificateNumberChanged,
  ProvisionalLicenseNotReceived,
  ProvisionalLicenseReceived,
} from '../../pass-completion.actions';
import { passCompletionCatDReducer } from '../pass-completion.cat-d.reducer';

describe('pass completion reducer', () => {
  it('should put that the code 78 was present into the state when selected', () => {
    const result = passCompletionCatDReducer(null, Code78Present());
    expect(result.code78Present).toBe(true);
  });
  it('should put that the code 78 was not present into the state when not selected', () => {
    const result = passCompletionCatDReducer(null, Code78NotPresent());
    expect(result.code78Present).toBe(false);
  });
  it('should set passCertificateNumber to the value passed', () => {
    const result = passCompletionCatDReducer(null, PassCertificateNumberChanged('test'));
    expect(result.passCertificateNumber).toBe('test');
  });
  it('should put that provisionalLicenceProvided is true into the state when selected', () => {
    const result = passCompletionCatDReducer(null, ProvisionalLicenseReceived());
    expect(result.provisionalLicenceProvided).toBe(true);
  });
  it('should put that provisionalLicenceProvided is false into the state when not selected', () => {
    const result = passCompletionCatDReducer(null, ProvisionalLicenseNotReceived());
    expect(result.provisionalLicenceProvided).toBe(false);
  });
});
