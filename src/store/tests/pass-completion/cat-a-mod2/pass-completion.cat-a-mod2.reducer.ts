import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { PassCompletion } from '@dvsa/mes-test-schema/categories/AM2';
import * as passCompletionActions from '../pass-completion.actions';

export const initialState: PassCompletion = {
  passCertificateNumber: null,
  provisionalLicenceProvided: null,
};

export const passCompletionCatAMod2Reducer = createReducer(
  initialState,
  on(passCompletionActions.PassCertificateNumberChanged, (state, { passCertificateNumber }): PassCompletion => ({
    ...state,
    passCertificateNumber,
  })),
  on(passCompletionActions.ProvisionalLicenseReceived, (state): PassCompletion => ({
    ...state,
    provisionalLicenceProvided: true,
  })),
  on(passCompletionActions.ProvisionalLicenseNotReceived, (state): PassCompletion => ({
    ...state,
    provisionalLicenceProvided: false,
  })),
);

export const getPassCompletion = createFeatureSelector<PassCompletion>('passCompletion');
