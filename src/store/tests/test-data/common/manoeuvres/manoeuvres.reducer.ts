import * as manoeuvresActions from '../../common/manoeuvres/manoeuvres.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';
import { ManoeuvreTypes } from '../../test-data.constants';
import { ManoeuvreUnion } from '../../../../../shared/unions/test-schema-unions';

export const initialState: ManoeuvreUnion = {
  reverseLeft: {},
};

export function manoeuvresReducer(
  state = initialState,
  action: manoeuvresActions.Types,
): ManoeuvreUnion {
  switch (action.type) {
    case manoeuvresActions.RECORD_MANOEUVRES_SELECTION:
      return {
        [action.manoeuvre]: {
          ...state[action.manoeuvre],
          selected: true,
        },
      };
    case manoeuvresActions.ADD_MANOEUVRE_DRIVING_FAULT:
      return {
        ...state,
        [action.payload.manoeuvre]: {
          ...state[action.payload.manoeuvre],
          selected: true,
          [action.payload.competency]: CompetencyOutcome.DF,
        },
      };
    case manoeuvresActions.ADD_MANOEUVRE_SERIOUS_FAULT:
      return {
        ...state,
        [action.payload.manoeuvre]: {
          ...state[action.payload.manoeuvre],
          selected: true,
          [action.payload.competency]: CompetencyOutcome.S,
        },
      };
    case manoeuvresActions.ADD_MANOEUVRE_DANGEROUS_FAULT:
      return {
        ...state,
        [action.payload.manoeuvre]: {
          ...state[action.payload.manoeuvre],
          selected: true,
          [action.payload.competency]: CompetencyOutcome.D,
        },
      };
    case manoeuvresActions.ADD_MANOEUVRE_COMMENT:
      return {
        ...state,
        [action.fieldName]: {
          ...state[action.fieldName],
          [`${action.controlOrObservation.toLocaleLowerCase()}FaultComments`]: action.comment,
        },
      };
    case manoeuvresActions.REMOVE_MANOEUVRE_FAULT:
      const {
        [action.payload.competency]: competencyToOmit, ...stateToPreserve
      } = state[action.payload.manoeuvre];
      return {
        ...state,
        [action.payload.manoeuvre]: stateToPreserve,
      };
    case manoeuvresActions.RECORD_MANOEUVRES_DESELECTION:
      return {
        ...state,
        [ManoeuvreTypes.reverseLeft]: {
          ...state[ManoeuvreTypes.reverseLeft],
          selected: false,
        },
      };
    default:
      return state;
  }
}
