import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/common';
import { preTestDeclarationsCatDReducer, initialState } from '../pre-test-declarations.cat-d.reducer';
import {
  ToggleInsuranceDeclaration,
  ToggleResidencyDeclaration,
  SignatureDataChanged,
  SignatureDataCleared,
  ClearPreTestDeclarations, CandidateDeclarationSigned, SetDeclarationStatus, ManoeuvresPassCertNumberChanged,
} from '../../pre-test-declarations.actions';

describe('PreTestDeclarations cat-d reducer', () => {
  it('should toggle the residency status when the toggle action is received', () => {
    const result = preTestDeclarationsCatDReducer(initialState, ToggleInsuranceDeclaration());
    expect(result.insuranceDeclarationAccepted).toBe(true);
  });

  it('should toggle the insurance status when the toggle action is received', () => {
    const result = preTestDeclarationsCatDReducer(initialState, ToggleResidencyDeclaration());
    expect(result.residencyDeclarationAccepted).toBe(true);
  });

  it('should change candidateDeclarationSigned to true when the toggle action is received', () => {
    const result = preTestDeclarationsCatDReducer(initialState, CandidateDeclarationSigned());
    expect(result.candidateDeclarationSigned).toBe(true);
  });

  it('should set the signature when the SignatureDataChanged action is received', () => {
    const result = preTestDeclarationsCatDReducer(initialState, SignatureDataChanged('ImSomeNewSignatureData'));
    expect(result.preTestSignature).toEqual('ImSomeNewSignatureData');
  });

  it('should clear the signature when the SignatureDataChanged action is received', () => {
    const state: PreTestDeclarations = {
      ...initialState,
      preTestSignature: 'SomeSignatureData',
    };
    const result = preTestDeclarationsCatDReducer(state, SignatureDataCleared());
    expect(result.preTestSignature).toEqual('');
  });

  it('should set the declarations when the declarationStatus action is received', () => {
    const result = preTestDeclarationsCatDReducer(initialState, SetDeclarationStatus(true));
    expect(result.insuranceDeclarationAccepted).toEqual(true);
    expect(result.residencyDeclarationAccepted).toEqual(true);
  });

  it('should set the pass certificate number when the SignatureDataChanged action is received', () => {
    const result = preTestDeclarationsCatDReducer(
      initialState, ManoeuvresPassCertNumberChanged('Pass Cert Number'),
    );
    expect(result.manoeuvrePassCertificateNumber).toEqual('Pass Cert Number');
  });

  it('should reset the default state when the clear action is received', () => {
    const dirtyState: PreTestDeclarations = {
      insuranceDeclarationAccepted: true,
      residencyDeclarationAccepted: true,
      preTestSignature: 'somesig',
    };

    const result = preTestDeclarationsCatDReducer(dirtyState, ClearPreTestDeclarations());

    expect(result).toEqual(initialState);
  });
});
