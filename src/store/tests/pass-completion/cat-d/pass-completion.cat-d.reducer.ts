import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as passCompletionActions from '../pass-completion.actions';

export const initialState: CatDUniqueTypes.PassCompletion = {
  passCertificateNumber: null,
  provisionalLicenceProvided: null,
  code78Present: null,
};

export const passCompletionCatDReducer = createReducer(
  initialState,
  on(passCompletionActions.Code78Present, (state) => ({
    ...state,
    code78Present: true,
  })),
  on(passCompletionActions.Code78NotPresent, (state) => ({
    ...state,
    code78Present: false,
  })),
  on(passCompletionActions.PassCertificateNumberChanged, (state, { passCertificateNumber }) => ({
    ...state,
    passCertificateNumber,
  })),
  on(passCompletionActions.ProvisionalLicenseReceived, (state) => ({
    ...state,
    provisionalLicenceProvided: true,
  })),
  on(passCompletionActions.ProvisionalLicenseNotReceived, (state) => ({
    ...state,
    provisionalLicenceProvided: false,
  })),
);

export const getPassCompletion = createFeatureSelector<CatDUniqueTypes.PassCompletion>('passCompletion');
