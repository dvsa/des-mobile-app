import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import * as preTestDeclarationActions from '../pre-test-declarations.actions';

export const initialState: CatDUniqueTypes.PreTestDeclarations = {
  insuranceDeclarationAccepted: false,
  residencyDeclarationAccepted: false,
  preTestSignature: '',
  candidateDeclarationSigned: false,
  manoeuvrePassCertificateNumber: null,
};

export const preTestDeclarationsCatDReducer = createReducer(
  initialState,
  on(preTestDeclarationActions.ClearPreTestDeclarations, (): CatDUniqueTypes.PreTestDeclarations => ({
    ...initialState,
  })),
  on(preTestDeclarationActions.ToggleInsuranceDeclaration, (state): CatDUniqueTypes.PreTestDeclarations => ({
    ...state,
    insuranceDeclarationAccepted: !state.insuranceDeclarationAccepted,
  })),
  on(preTestDeclarationActions.ToggleResidencyDeclaration, (state): CatDUniqueTypes.PreTestDeclarations => ({
    ...state,
    residencyDeclarationAccepted: !state.residencyDeclarationAccepted,
  })),
  on(preTestDeclarationActions.SignatureDataChanged, (state, { signature }): CatDUniqueTypes.PreTestDeclarations => ({
    ...state,
    preTestSignature: signature,
  })),
  on(preTestDeclarationActions.SignatureDataCleared, (state): CatDUniqueTypes.PreTestDeclarations => ({
    ...state,
    preTestSignature: '',
  })),
  on(preTestDeclarationActions.CandidateDeclarationSigned, (state): CatDUniqueTypes.PreTestDeclarations => ({
    ...state,
    candidateDeclarationSigned: true,
  })),
  on(preTestDeclarationActions.SetDeclarationStatus, (state, {
    declarationStatus,
  }): CatDUniqueTypes.PreTestDeclarations => ({
    ...state,
    insuranceDeclarationAccepted: declarationStatus,
    residencyDeclarationAccepted: declarationStatus,
  })),
  on(preTestDeclarationActions.ManoeuvresPassCertNumberChanged, (state, {
    manoeuvrePassCertificateNumber,
  }): CatDUniqueTypes.PreTestDeclarations => ({
    ...state,
    manoeuvrePassCertificateNumber,
  })),
);

export const getPreTestDeclarations = createFeatureSelector<CatDUniqueTypes.PreTestDeclarations>('preTestDeclarations');
