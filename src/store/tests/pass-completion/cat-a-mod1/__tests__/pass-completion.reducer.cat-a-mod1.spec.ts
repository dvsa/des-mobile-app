import { PassCertificateNumberChanged } from '../../pass-completion.actions';
import { initialState, passCompletionCatAMod1Reducer } from '../pass-completion.cat-a-mod1.reducer';

describe('pass completion reducer', () => {
  it('should put the pass certificate number into the state on pass certificate number changed action', () => {
    const result = passCompletionCatAMod1Reducer(initialState, PassCertificateNumberChanged('ABC123'));
    expect(result.passCertificateNumber).toBe('ABC123');
  });
});
