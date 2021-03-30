import * as passCompletionActions from '../pass-completion.actions';

import { createFeatureSelector } from '@ngrx/store';
import { PassCompletion } from '@dvsa/mes-test-schema/categories/CPC';

export const initialState: PassCompletion = {
  passCertificateNumber: null,
};

export const passCompletionCatCPCReducer = (
  state = initialState,
  action: passCompletionActions.Types,
): PassCompletion => {
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
