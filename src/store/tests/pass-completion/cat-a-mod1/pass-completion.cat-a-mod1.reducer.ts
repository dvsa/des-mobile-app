import { PassCompletion } from '@dvsa/mes-test-schema/categories/AM1';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as passCompletionActions from '../pass-completion.actions';

export const initialState: PassCompletion = {
  passCertificateNumber: null,
};

export const passCompletionCatAMod1Reducer = createReducer(
  initialState,
  on(
    passCompletionActions.PassCertificateNumberChanged,
    (state, { passCertificateNumber }): PassCompletion => ({
      ...state,
      passCertificateNumber,
    })
  )
);

export const getPassCompletion = createFeatureSelector<PassCompletion>('passCompletion');
