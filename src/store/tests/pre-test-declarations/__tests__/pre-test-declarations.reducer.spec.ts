import { preTestDeclarationsReducer, initialState } from '../common/pre-test-declarations.reducer';
import {
  ToggleInsuranceDeclaration,
  ToggleResidencyDeclaration,
  SignatureDataChanged,
  SignatureDataCleared,
  ClearPreTestDeclarations,
} from '../common/pre-test-declarations.actions';
import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/common';

describe('PreTestDeclarations reducer', () => {
  it('should toggle the residency status when the toggle action is received', () => {
    const result = preTestDeclarationsReducer(initialState, new ToggleInsuranceDeclaration());
    expect(result.insuranceDeclarationAccepted).toBe(true);
  });

  it('should toggle the insurance status when the toggle action is received', () => {
    const result = preTestDeclarationsReducer(initialState, new ToggleResidencyDeclaration);
    expect(result.residencyDeclarationAccepted).toBe(true);
  });

  it('should set the signature when the SignatureDataChanged action is received', () => {
    const result = preTestDeclarationsReducer(initialState, new SignatureDataChanged('ImSomeNewSignatureData'));
    expect(result.preTestSignature).toEqual('ImSomeNewSignatureData');
  });

  it('should clear the signature when the SignatureDataChanged action is received', () => {
    const state: PreTestDeclarations = {
      ...initialState,
      preTestSignature: 'SomeSignatureData',
    };
    const result = preTestDeclarationsReducer(state, new SignatureDataCleared());
    expect(result.preTestSignature).toEqual('');
  });

  it('should reset the default state when the clear action is received', () => {
    const dirtyState: PreTestDeclarations = {
      insuranceDeclarationAccepted: true,
      residencyDeclarationAccepted: true,
      preTestSignature: 'somesig',
    };

    const result = preTestDeclarationsReducer(dirtyState, new ClearPreTestDeclarations());

    expect(result).toBe(initialState);
  });
});
