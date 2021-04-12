import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { passCompletionCatCReducer, initialState } from '../pass-completion.cat-c.reducer';
import {
  PassCertificateNumberChanged,
  ProvisionalLicenseReceived,
  ProvisionalLicenseNotReceived,
  Code78Present,
  Code78NotPresent,
} from '../../pass-completion.actions';

describe('pass completion reducer', () => {
  const mockInitialState = {
    ...initialState,
  } as CatCUniqueTypes.PassCompletion;
  it('should put the pass certificate number into the state on pass certificate number changed action', () => {
    const result = passCompletionCatCReducer(mockInitialState, PassCertificateNumberChanged('ABC123'));
    expect(result.passCertificateNumber).toBe('ABC123');
  });

  it('should put that the provisional license was received into state when yes selected', () => {
    const result = passCompletionCatCReducer(mockInitialState, ProvisionalLicenseReceived());
    expect(result.provisionalLicenceProvided).toBe(true);
  });

  it('should put that the provisional license was not received into state when no selected', () => {
    const result = passCompletionCatCReducer(mockInitialState, ProvisionalLicenseNotReceived());
    expect(result.provisionalLicenceProvided).toBe(false);
  });

  it('should toggle whether the provisional license was received', () => {
    let result = passCompletionCatCReducer(mockInitialState, ProvisionalLicenseReceived());
    expect(result.provisionalLicenceProvided).toBe(true);
    result = passCompletionCatCReducer(mockInitialState, ProvisionalLicenseNotReceived());
    expect(result.provisionalLicenceProvided).toBe(false);
  });

  it('should put that the code 78 was present into the state when selected', () => {
    const result = passCompletionCatCReducer(mockInitialState, Code78Present());
    expect(result.code78Present).toBe(true);
  });

  it('should put that the code 78 was not present into the state when not selected', () => {
    const result = passCompletionCatCReducer(mockInitialState, Code78NotPresent());
    expect(result.code78Present).toBe(false);
  });
});
