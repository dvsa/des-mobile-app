import * as passCompletionActions from '../pass-completion.actions';

import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { PassCompletion } from '@dvsa/mes-test-schema/categories/AM1';

export const initialState: PassCompletion = {
  passCertificateNumber: null,
};

export const passCompletionCatAMod1Reducer = createReducer(
  initialState,
  on(passCompletionActions.PassCertificateNumberChanged, (state, {
    passCertificateNumber,
  }): PassCompletion => ({
    ...state,
    passCertificateNumber,
  })),
);

export const getPassCompletion = createFeatureSelector<PassCompletion>('passCompletion');
