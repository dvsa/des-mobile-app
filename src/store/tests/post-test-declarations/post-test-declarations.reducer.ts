import { PostTestDeclarations } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as postTestDeclarationActions from './post-test-declarations.actions';

export const initialState: PostTestDeclarations = {
  healthDeclarationAccepted: false,
  passCertificateNumberReceived: false,
  postTestSignature: '',
};

export const postTestDeclarationsReducer = createReducer(
  initialState,
  on(postTestDeclarationActions.ClearPostTestDeclarations, (): PostTestDeclarations => ({
    ...initialState,
  })),
  on(postTestDeclarationActions.ToggleHealthDeclaration, (state): PostTestDeclarations => ({
    ...state,
    healthDeclarationAccepted: !state.healthDeclarationAccepted,
  })),
  on(postTestDeclarationActions.HealthDeclarationAccepted, (state, { payload }): PostTestDeclarations => ({
    ...state,
    healthDeclarationAccepted: payload,
  })),
  on(postTestDeclarationActions.ToggleReceiptDeclaration, (state): PostTestDeclarations => ({
    ...state,
    passCertificateNumberReceived: !state.passCertificateNumberReceived,
  })),
  on(postTestDeclarationActions.PassCertificateNumberReceived, (state, {
    passCertNumberReceived,
  }): PostTestDeclarations => ({
    ...state,
    passCertificateNumberReceived: passCertNumberReceived,
  })),
  on(postTestDeclarationActions.SignatureDataChanged, (state, { signature }): PostTestDeclarations => ({
    ...state,
    postTestSignature: signature,
  })),
  on(postTestDeclarationActions.SignatureDataCleared, (state): PostTestDeclarations => ({
    ...state,
    postTestSignature: '',
  })),
);

export const getPostTestDeclarations = createFeatureSelector<PostTestDeclarations>('postTestDeclarations');
