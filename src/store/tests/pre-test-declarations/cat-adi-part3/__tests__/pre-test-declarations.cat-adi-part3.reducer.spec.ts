import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/common';
import { preTestDeclarationsCatADI3Reducer, initialState } from '../pre-test-declarations.cat-adi-part3.reducer';
import {
  ToggleInsuranceDeclaration,
  ToggleResidencyDeclaration,
  SignatureDataChanged,
  SignatureDataCleared,
  ClearPreTestDeclarations, ValidPassCertChanged, SetDeclarationStatus,
} from '../../pre-test-declarations.actions';

describe('PreTestDeclarations ADI3 reducer', () => {
  it('should toggle the residency status when the toggle action is received', () => {
    const result = preTestDeclarationsCatADI3Reducer(initialState, ToggleInsuranceDeclaration());
    expect(result.insuranceDeclarationAccepted).toBe(true);
  });

  it('should toggle the insurance status when the toggle action is received', () => {
    const result = preTestDeclarationsCatADI3Reducer(initialState, ToggleResidencyDeclaration());
    expect(result.residencyDeclarationAccepted).toBe(true);
  });

  it('should set the signature when the SignatureDataChanged action is received', () => {
    const result = preTestDeclarationsCatADI3Reducer(initialState, SignatureDataChanged('ImSomeNewSignatureData'));
    expect(result.preTestSignature).toEqual('ImSomeNewSignatureData');
  });

  it('should clear the signature when the SignatureDataChanged action is received', () => {
    const state: PreTestDeclarations = {
      ...initialState,
      preTestSignature: 'SomeSignatureData',
    };
    const result = preTestDeclarationsCatADI3Reducer(state, SignatureDataCleared());
    expect(result.preTestSignature).toEqual('');
  });

  it('should set the validCertificate when the validCertificate action is received', () => {
    const result = preTestDeclarationsCatADI3Reducer(initialState, ValidPassCertChanged(true));
    expect(result.validCertificate).toEqual(true);
  });

  it('should set the declarations when the declarationStatus action is received', () => {
    const result = preTestDeclarationsCatADI3Reducer(initialState, SetDeclarationStatus(true));
    expect(result.insuranceDeclarationAccepted).toEqual(true);
    expect(result.residencyDeclarationAccepted).toEqual(true);
  });

  it('should reset the default state when the clear action is received', () => {
    const dirtyState: PreTestDeclarations = {
      insuranceDeclarationAccepted: true,
      residencyDeclarationAccepted: true,
      preTestSignature: 'somesig',
    };

    const result = preTestDeclarationsCatADI3Reducer(dirtyState, ClearPreTestDeclarations());

    expect(result).toEqual(initialState);
  });
});
