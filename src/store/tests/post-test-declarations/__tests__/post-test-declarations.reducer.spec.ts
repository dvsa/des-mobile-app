import { PostTestDeclarations } from '@dvsa/mes-test-schema/categories/common';
import {
  ClearPostTestDeclarations,
  SignatureDataChanged,
  SignatureDataCleared,
  ToggleHealthDeclaration,
  ToggleReceiptDeclaration,
} from '../post-test-declarations.actions';
import { initialState, postTestDeclarationsReducer } from '../post-test-declarations.reducer';

describe('PostTestDeclarations reducer', () => {
  it('should toggle the health declaration status when the toggle action is received', () => {
    const result = postTestDeclarationsReducer(initialState, ToggleHealthDeclaration());
    expect(result.healthDeclarationAccepted).toBe(true);
  });

  it('should toggle the certificate recieved status when the toggle action is received', () => {
    const result = postTestDeclarationsReducer(initialState, ToggleReceiptDeclaration);
    expect(result.passCertificateNumberReceived).toBe(true);
  });

  it('should set the signature when the SignatureDataChanged action is received', () => {
    const result = postTestDeclarationsReducer(initialState, SignatureDataChanged('ImSomeNewSignatureData'));
    expect(result.postTestSignature).toEqual('ImSomeNewSignatureData');
  });

  it('should clear the signature when the SignatureDataChanged action is received', () => {
    const state: PostTestDeclarations = {
      ...initialState,
      postTestSignature: 'SomeSignatureData',
    };
    const result = postTestDeclarationsReducer(state, SignatureDataCleared());
    expect(result.postTestSignature).toEqual('');
  });

  it('should reset the default state when the clear action is received', () => {
    const dirtyState: PostTestDeclarations = {
      healthDeclarationAccepted: true,
      passCertificateNumberReceived: true,
      postTestSignature: 'somesig',
    };

    const result = postTestDeclarationsReducer(dirtyState, ClearPostTestDeclarations());

    expect(result).toEqual(initialState);
  });
});
