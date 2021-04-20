import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/AM1';
import {
  ToggleInsuranceDeclaration,
  ToggleResidencyDeclaration,
  SignatureDataChanged,
  SignatureDataCleared,
  ClearPreTestDeclarations,
} from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { preTestDeclarationsCatAMod1Reducer, initialState } from '../pre-test-declarations.cat-a-mod1.reducer';
import { CbtNumberChanged } from '../../cat-a/pre-test-declarations.cat-a.actions';

describe('PreTestDeclarations category a mod1 reducer', () => {
  it('should toggle the residency status when the toggle action is received', () => {
    const result = preTestDeclarationsCatAMod1Reducer(initialState, ToggleInsuranceDeclaration());
    expect(result.insuranceDeclarationAccepted).toBe(true);
  });

  it('should toggle the insurance status when the toggle action is received', () => {
    const result = preTestDeclarationsCatAMod1Reducer(initialState, ToggleResidencyDeclaration());
    expect(result.residencyDeclarationAccepted).toBe(true);
  });

  it('should set the signature when the SignatureDataChanged action is received', () => {
    const result = preTestDeclarationsCatAMod1Reducer(initialState, SignatureDataChanged('ImSomeNewSignatureData'));
    expect(result.preTestSignature).toEqual('ImSomeNewSignatureData');
  });

  it('should clear the signature when the SignatureDataChanged action is received', () => {
    const state: PreTestDeclarations = {
      ...initialState,
      preTestSignature: 'SomeSignatureData',
    };
    const result = preTestDeclarationsCatAMod1Reducer(state, SignatureDataCleared());
    expect(result.preTestSignature).toEqual('');
  });

  it('should put the CBT number into the state on cbt number changed action', () => {
    const result = preTestDeclarationsCatAMod1Reducer(initialState, CbtNumberChanged('12345678'));
    expect(result.DL196CBTCertNumber).toBe('12345678');
  });

  it('should reset the default state when the clear action is received', () => {
    const dirtyState: PreTestDeclarations = {
      insuranceDeclarationAccepted: true,
      residencyDeclarationAccepted: true,
      preTestSignature: 'somesig',
    };

    const result = preTestDeclarationsCatAMod1Reducer(dirtyState, ClearPreTestDeclarations());

    expect(result).toEqual(initialState);
  });
});
