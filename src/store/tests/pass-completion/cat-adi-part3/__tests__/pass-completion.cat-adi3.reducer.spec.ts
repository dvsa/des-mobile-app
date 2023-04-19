import {
  passCompletionCatADI3Reducer,
} from '@store/tests/pass-completion/cat-adi-part3/pass-completion.cat-adi3.reducer';
import * as fromTestSummaryActions from '../../pass-completion.actions';

describe('passCompletionCatADI3Reducer', () => {
  describe('PassCertificateNumberChanged', () => {
    it('should set passCertificateNumber to the value passed when called', () => {
      const result = passCompletionCatADI3Reducer(
        { passCertificateNumber: '1' }, fromTestSummaryActions.PassCertificateNumberChanged('2'),
      );
      expect(result).toEqual({ passCertificateNumber: '2' });
    });
  });
});
