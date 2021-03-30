import { passCompletionCatAMod1Reducer, initialState } from '../pass-completion.cat-a-mod1.reducer';
import {
  PassCertificateNumberChanged,
} from '../../pass-completion.actions';

describe('pass completion reducer', () => {
  it('should put the pass certificate number into the state on pass certificate number changed action', () => {
    const result = passCompletionCatAMod1Reducer(initialState, new PassCertificateNumberChanged('ABC123'));
    expect(result.passCertificateNumber).toBe('ABC123');
  });
});
