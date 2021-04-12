import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as passCompletionActions from '../pass-completion.actions';

export const initialState: CatCUniqueTypes.PassCompletion = {
  passCertificateNumber: null,
  provisionalLicenceProvided: null,
  code78Present: null,
};

export const passCompletionCatCReducer = createReducer(
  initialState,
  on(passCompletionActions.Code78Present, (state): CatCUniqueTypes.PassCompletion => ({
    ...state,
    code78Present: true,
  })),
  on(passCompletionActions.Code78NotPresent, (state): CatCUniqueTypes.PassCompletion => ({
    ...state,
    code78Present: false,
  })),
  on(passCompletionActions.PassCertificateNumberChanged, (state, {
    passCertificateNumber,
  }): CatCUniqueTypes.PassCompletion => ({
    ...state,
    passCertificateNumber,
  })),
  on(passCompletionActions.Code78NotPresent, (state): CatCUniqueTypes.PassCompletion => ({
    ...state,
    code78Present: false,
  })),
  on(passCompletionActions.ProvisionalLicenseReceived, (state): CatCUniqueTypes.PassCompletion => ({
    ...state,
    provisionalLicenceProvided: true,
  })),
  on(passCompletionActions.ProvisionalLicenseNotReceived, (state): CatCUniqueTypes.PassCompletion => ({
    ...state,
    provisionalLicenceProvided: false,
  })),
);

export const getPassCompletion = createFeatureSelector<CatCUniqueTypes.PassCompletion>('passCompletion');
