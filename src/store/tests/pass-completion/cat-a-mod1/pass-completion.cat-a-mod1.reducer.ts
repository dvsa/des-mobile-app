import * as passCompletionActions from '../pass-completion.actions';

import { createFeatureSelector } from '@ngrx/store';
import { PassCompletion } from '@dvsa/mes-test-schema/categories/AM1';

export const initialState: PassCompletion = {
  passCertificateNumber: null,
};

export const passCompletionCatAMod1Reducer = (state = initialState, action: passCompletionActions.Types) => {
  switch (action.type) {
    case passCompletionActions.PASS_CERTIFICATE_NUMBER_CHANGED:
      return {
        ...state,
        passCertificateNumber: action.passCertificateNumber,
      };
    default:
      return state;
  }
};

export const getPassCompletion = createFeatureSelector<PassCompletion>('passCompletion');
