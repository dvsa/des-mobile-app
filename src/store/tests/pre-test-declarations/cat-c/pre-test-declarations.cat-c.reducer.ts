import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import * as preTestDeclarationActions from '../pre-test-declarations.actions';
import * as catCPreTestDeclarationActions from './pre-test-declarations.cat-c.actions';

export const initialState: CatCUniqueTypes.PreTestDeclarations = {
  insuranceDeclarationAccepted: false,
  residencyDeclarationAccepted: false,
  preTestSignature: '',
  candidateDeclarationSigned: false,
  manoeuvrePassCertificateNumber: null,
};

export const preTestDeclarationsCatCReducer = createReducer(
  initialState,
  on(preTestDeclarationActions.ClearPreTestDeclarations, (): CatCUniqueTypes.PreTestDeclarations => ({
    ...initialState,
  })),
  on(preTestDeclarationActions.ToggleInsuranceDeclaration, (state): CatCUniqueTypes.PreTestDeclarations => ({
    ...state,
    insuranceDeclarationAccepted: !state.insuranceDeclarationAccepted,
  })),
  on(preTestDeclarationActions.ToggleResidencyDeclaration, (state): CatCUniqueTypes.PreTestDeclarations => ({
    ...state,
    residencyDeclarationAccepted: !state.residencyDeclarationAccepted,
  })),
  on(preTestDeclarationActions.SignatureDataChanged, (state, { signature }): CatCUniqueTypes.PreTestDeclarations => ({
    ...state,
    preTestSignature: signature,
  })),
  on(preTestDeclarationActions.SignatureDataCleared, (state): CatCUniqueTypes.PreTestDeclarations => ({
    ...state,
    preTestSignature: '',
  })),
  on(preTestDeclarationActions.CandidateDeclarationSigned, (state): CatCUniqueTypes.PreTestDeclarations => ({
    ...state,
    candidateDeclarationSigned: true,
  })),
  on(preTestDeclarationActions.SetDeclarationStatus, (state, {
    declarationStatus,
  }): CatCUniqueTypes.PreTestDeclarations => ({
    ...state,
    insuranceDeclarationAccepted: declarationStatus,
    residencyDeclarationAccepted: declarationStatus,
  })),
  on(catCPreTestDeclarationActions.ManoeuvresPassCertNumberChanged, (state, {
    manoeuvrePassCertificateNumber,
  }): CatCUniqueTypes.PreTestDeclarations => ({
    ...state,
    manoeuvrePassCertificateNumber,
  })),
);

export const getPreTestDeclarations = createFeatureSelector<CatCUniqueTypes.PreTestDeclarations>('preTestDeclarations');
