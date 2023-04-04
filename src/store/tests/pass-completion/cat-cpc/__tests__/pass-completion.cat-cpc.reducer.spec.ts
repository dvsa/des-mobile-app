import { passCompletionCatCPCReducer } from '@store/tests/pass-completion/cat-cpc/pass-completion.cat-cpc.reducer';
import * as passCompletionActions from '../../pass-completion.actions';

describe('passCompletionCatCPCReducer', () => {

  describe('PassCertificateNumberChanged', () => {
    it('should set pass certificate number to the value given', () => {
      const result = passCompletionCatCPCReducer(
        { passCertificateNumber: null }, passCompletionActions.PassCertificateNumberChanged('test'),
      );
      expect(result).toEqual({ passCertificateNumber: 'test' });
    });
  });
});
