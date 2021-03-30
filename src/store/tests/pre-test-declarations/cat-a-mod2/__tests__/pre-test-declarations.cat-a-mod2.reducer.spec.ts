import { preTestDeclarationsCatAMod2Reducer, initialState } from '../pre-test-declarations.cat-a-mod2.reducer';
import {
  ToggleInsuranceDeclaration,
  ToggleResidencyDeclaration,
  SignatureDataChanged,
  SignatureDataCleared,
  ClearPreTestDeclarations,
} from '../../common/pre-test-declarations.actions';
import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/AM2';
import { CbtNumberChanged } from '../../cat-a/pre-test-declarations.cat-a.actions';

describe('PreTestDeclarations Cat A Mod2 reducer', () => {
  it('should toggle the residency status when the toggle action is received', () => {
    const result = preTestDeclarationsCatAMod2Reducer(initialState, new ToggleResidencyDeclaration);
    expect(result.residencyDeclarationAccepted).toBe(true);
  });

  it('should toggle the insurance status when the toggle action is received', () => {
    const result = preTestDeclarationsCatAMod2Reducer(initialState, new ToggleInsuranceDeclaration());
    expect(result.insuranceDeclarationAccepted).toBe(true);
  });

  it('should set the signature when the SignatureDataChanged action is received', () => {
    const result = preTestDeclarationsCatAMod2Reducer(initialState, new SignatureDataChanged('ImSomeNewSignatureData'));
    expect(result.preTestSignature).toEqual('ImSomeNewSignatureData');
  });

  it('should clear the signature when the SignatureDataChanged action is received', () => {
    const state: PreTestDeclarations = {
      ...initialState,
      preTestSignature: 'SomeSignatureData',
    };
    const result = preTestDeclarationsCatAMod2Reducer(state, new SignatureDataCleared());
    expect(result.preTestSignature).toEqual('');
  });

  it('should reset the default state when the clear action is received', () => {
    const dirtyState: PreTestDeclarations = {
      insuranceDeclarationAccepted: true,
      residencyDeclarationAccepted: true,
      preTestSignature: 'somesig',
      DL196CBTCertNumber: '123456',
    };

    const result = preTestDeclarationsCatAMod2Reducer(dirtyState, new ClearPreTestDeclarations());

    expect(result).toBe(initialState);
  });

  it('should put the CBT number into the state on certificate number changed action', () => {
    const result = preTestDeclarationsCatAMod2Reducer(initialState, new CbtNumberChanged('12345678'));
    expect(result.DL196CBTCertNumber).toBe('12345678');
  });
});
