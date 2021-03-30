import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/common';
import * as preTestDeclarationActions from './pre-test-declarations.actions';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: PreTestDeclarations = {
  insuranceDeclarationAccepted: false,
  residencyDeclarationAccepted: false,
  preTestSignature: '',
  candidateDeclarationSigned: false,
};

export function preTestDeclarationsReducer(
  state = initialState,
  action: preTestDeclarationActions.Types,
): PreTestDeclarations {
  switch (action.type) {
    case preTestDeclarationActions.CLEAR_DECLARATIONS:
      return initialState;
    case preTestDeclarationActions.TOGGLE_INSURANCE_DECLARATION:
      return {
        ...state,
        insuranceDeclarationAccepted: !state.insuranceDeclarationAccepted,
      };
    case preTestDeclarationActions.TOGGLE_RESIDENCY_DECLARATION:
      return {
        ...state,
        residencyDeclarationAccepted: !state.residencyDeclarationAccepted,
      };
    case preTestDeclarationActions.SIGNATURE_DATA_CHANGED:
      return {
        ...state,
        preTestSignature: action.payload,
      };
    case preTestDeclarationActions.SIGNATURE_DATA_CLEARED:
      return {
        ...state,
        preTestSignature: '',
      };
    case preTestDeclarationActions.CANDIDATE_DECLARATION_SIGNED:
      return {
        ...state,
        candidateDeclarationSigned: true,
      };
    case preTestDeclarationActions.SET_DECLARATION_STATUS:
      return {
        ...state,
        insuranceDeclarationAccepted: action.payload,
        residencyDeclarationAccepted: action.payload,
      };
    default:
      return state;
  }
}

export const getPreTestDeclarations = createFeatureSelector<PreTestDeclarations>('preTestDeclarations');
