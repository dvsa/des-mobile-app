import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/AM1';
import * as preTestDeclarationActionsCatAMod1 from
  '../cat-a/pre-test-declarations.cat-a.actions';
import * as preTestDeclarationActions from '../pre-test-declarations.actions';

export const initialState: PreTestDeclarations = {
  insuranceDeclarationAccepted: false,
  residencyDeclarationAccepted: false,
  preTestSignature: '',
  DL196CBTCertNumber: '',
};

export const preTestDeclarationsCatAMod1Reducer = createReducer(
  initialState,
  on(preTestDeclarationActions.ClearPreTestDeclarations, (): PreTestDeclarations => ({
    ...initialState,
  })),
  on(preTestDeclarationActions.ToggleInsuranceDeclaration, (state): PreTestDeclarations => ({
    ...state,
    insuranceDeclarationAccepted: !state.insuranceDeclarationAccepted,
  })),
  on(preTestDeclarationActions.ToggleResidencyDeclaration, (state): PreTestDeclarations => ({
    ...state,
    residencyDeclarationAccepted: !state.residencyDeclarationAccepted,
  })),
  on(preTestDeclarationActions.SignatureDataChanged, (state, { signature }): PreTestDeclarations => ({
    ...state,
    preTestSignature: signature,
  })),
  on(preTestDeclarationActions.SignatureDataCleared, (state): PreTestDeclarations => ({
    ...state,
    preTestSignature: '',
  })),
  on(preTestDeclarationActionsCatAMod1.CbtNumberChanged, (state, { cbtNumber }): PreTestDeclarations => ({
    ...state,
    DL196CBTCertNumber: cbtNumber,
  })),
);

export const getPreTestDeclarationsCatAMod1 = createFeatureSelector<PreTestDeclarations>('preTestDeclarations');
