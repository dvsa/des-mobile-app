import * as passCompletionActions from './pass-completion.actions';

import { createFeatureSelector } from '@ngrx/store';
import { PassCompletion } from '@dvsa/mes-test-schema/categories/common';

export const initialState: PassCompletion = {
  passCertificateNumber: null,
  provisionalLicenceProvided: null,
};

export const passCompletionReducer = (state = initialState, action: passCompletionActions.Types) => {
  switch (action.type) {
    case passCompletionActions.PASS_CERTIFICATE_NUMBER_CHANGED:
      return {
        ...state,
        passCertificateNumber: action.passCertificateNumber,
      };
    case passCompletionActions.PROVISIONAL_LICENSE_RECEIVED:
      return {
        ...state,
        provisionalLicenceProvided: true,
      };
    case passCompletionActions.PROVISIONAL_LICENSE_NOT_RECEIVED:
      return {
        ...state,
        provisionalLicenceProvided: false,
      };
    default:
      return state;
  }
};

export const getPassCompletion = createFeatureSelector<PassCompletion>('passCompletion');
