import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/common';
import * as preTestDeclarationActions from './pre-test-declarations.actions';

export const initialState: PreTestDeclarations = {
  insuranceDeclarationAccepted: false,
  residencyDeclarationAccepted: false,
  preTestSignature: '',
  candidateDeclarationSigned: false,
};

export const preTestDeclarationsReducer = createReducer(
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
  on(preTestDeclarationActions.SignatureDataChanged, (state, { payload }): PreTestDeclarations => ({
    ...state,
    preTestSignature: payload,
  })),
  on(preTestDeclarationActions.SignatureDataCleared, (state): PreTestDeclarations => ({
    ...state,
    preTestSignature: '',
  })),
  on(preTestDeclarationActions.CandidateDeclarationSigned, (state): PreTestDeclarations => ({
    ...state,
    candidateDeclarationSigned: true,
  })),
  on(preTestDeclarationActions.SetDeclarationStatus, (state, { payload }): PreTestDeclarations => ({
    ...state,
    insuranceDeclarationAccepted: payload,
    residencyDeclarationAccepted: payload,
  })),
);

export const getPreTestDeclarations = createFeatureSelector<PreTestDeclarations>('preTestDeclarations');
