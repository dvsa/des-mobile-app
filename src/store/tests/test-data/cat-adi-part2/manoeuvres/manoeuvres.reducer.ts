import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import * as manoeuvresActions from './manoeuvres.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';

export const initialState: CatADI2UniqueTypes.Manoeuvres[] = [{}, {}];

export function manoeuvresCatADI2Reducer(
  state = initialState,
  action: manoeuvresActions.Types,
): CatADI2UniqueTypes.Manoeuvres[] {
  switch (action.type) {
    case manoeuvresActions.RECORD_MANOEUVRES_SELECTION:
      return [
        ...state.slice(0, action.index),
        ...[{
          [action.manoeuvre]: {
            ...state[action.index][action.manoeuvre],
            selected: true,
          },
        }],
        ...state.slice(action.index + 1),
      ];
    case manoeuvresActions.RECORD_MANOEUVRES_DESELECTION:
      return [
        ...state.slice(0, action.index),
        ...[{}],
        ...state.slice(action.index + 1),
      ];
    case manoeuvresActions.ADD_MANOEUVRE_DRIVING_FAULT:
      return [
        ...state.slice(0, action.index),
        ...[{
          [action.payload.manoeuvre]: {
            ...state[action.index][action.payload.manoeuvre],
            [action.payload.competency]: CompetencyOutcome.DF,
          },
        }],
        ...state.slice(action.index + 1),
      ];
    case manoeuvresActions.ADD_MANOEUVRE_SERIOUS_FAULT:
      return [
        ...state.slice(0, action.index),
        ...[{
          [action.payload.manoeuvre]: {
            ...state[action.index][action.payload.manoeuvre],
            [action.payload.competency]: CompetencyOutcome.S,
          },
        }],
        ...state.slice(action.index + 1),
      ];
    case manoeuvresActions.ADD_MANOEUVRE_DANGEROUS_FAULT:
      return [
        ...state.slice(0, action.index),
        ...[{
          [action.payload.manoeuvre]: {
            ...state[action.index][action.payload.manoeuvre],
            [action.payload.competency]: CompetencyOutcome.D,
          },
        }],
        ...state.slice(action.index + 1),
      ];
    case manoeuvresActions.REMOVE_MANOEUVRE_FAULT:
      const {
        [action.payload.competency]: competencyToOmit, ...stateToPreserve
      } = state[action.index][action.payload.manoeuvre];

      return [
        ...state.slice(0, action.index),
        ...[{
          [action.payload.manoeuvre]: {
            ...stateToPreserve,
          },
        }],
        ...state.slice(action.index + 1),
      ];
    case manoeuvresActions.ADD_MANOEUVRE_COMMENT:
      return [
        ...state.slice(0, action.index),
        ...[{
          [action.fieldName]: {
            ...state[action.index][action.fieldName],
            [`${action.controlOrObservation.toLocaleLowerCase()}FaultComments`]: action.comment,
          },
        }],
        ...state.slice(action.index + 1),
      ];
    default:
      return state;
  }
}
