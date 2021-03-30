import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/AM2';
import * as preTestDeclarationActions from '../common/pre-test-declarations.actions';
import * as preTestDeclarationActionsCatAMod2 from '../cat-a/pre-test-declarations.cat-a.actions';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: PreTestDeclarations = {
  insuranceDeclarationAccepted: false,
  residencyDeclarationAccepted: false,
  preTestSignature: '',
  DL196CBTCertNumber: '',
};

export function preTestDeclarationsCatAMod2Reducer(
  state = initialState,
  action: preTestDeclarationActionsCatAMod2.Types | preTestDeclarationActions.Types,
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
    case preTestDeclarationActionsCatAMod2.CBT_NUMBER_CHANGED:
      return {
        ...state,
        DL196CBTCertNumber: action.cbtNumber,
      };

    default:
      return state;
  }
}

export const getPreTestDeclarationsCatAMod2 = createFeatureSelector<PreTestDeclarations>('preTestDeclarations');
