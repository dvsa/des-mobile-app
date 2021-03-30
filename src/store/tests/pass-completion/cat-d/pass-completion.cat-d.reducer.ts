import * as passCompletionActions from '../pass-completion.actions';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: CatDUniqueTypes.PassCompletion = {
  passCertificateNumber: null,
  provisionalLicenceProvided: null,
  code78Present: null,
};

export const passCompletionCatDReducer = (
  state = initialState,
  action: passCompletionActions.Types,
): CatDUniqueTypes.PassCompletion => {
  switch (action.type) {
    case passCompletionActions.CODE_78_PRESENT:
      return {
        ...state,
        code78Present: true,
      };
    case passCompletionActions.CODE_78_NOT_PRESENT:
      return {
        ...state,
        code78Present: false,
      };
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

export const getPassCompletion = createFeatureSelector<CatDUniqueTypes.PassCompletion>('passCompletion');
