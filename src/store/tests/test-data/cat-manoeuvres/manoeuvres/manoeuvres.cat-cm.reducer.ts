import { createReducer, on } from '@ngrx/store';
import { CompetencyOutcome } from 'src/app/shared/models/competency-outcome';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { CatCEMUniqueTypes } from '@dvsa/mes-test-schema/categories/CEM';
import { CatC1MUniqueTypes } from '@dvsa/mes-test-schema/categories/C1M';
import { CatC1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/C1EM';
import * as manoeuvresActions from '../../common/manoeuvres/manoeuvres.actions';

export const initialState: CatCMUniqueTypes.Manoeuvres |
CatCEMUniqueTypes.Manoeuvres |
CatC1MUniqueTypes.Manoeuvres |
CatC1EMUniqueTypes.Manoeuvres = {
  reverseManoeuvre: {},
};

export const manoeuvresCatManoeuvreReducer = createReducer(
  initialState,
  on(
    manoeuvresActions.RecordManoeuvresSelection,
    (state, { manoeuvre }) => ({
      [manoeuvre]: {
        ...state[manoeuvre],
        selected: true,
      },
    }),
  ),
  on(
    manoeuvresActions.AddManoeuvreDrivingFault,
    (state, { manoeuvrePayload }) => ({
      ...state,
      [manoeuvrePayload.manoeuvre]: {
        ...state[manoeuvrePayload.manoeuvre],
        [manoeuvrePayload.competency]: CompetencyOutcome.DF,
      },
    }),
  ),
  on(
    manoeuvresActions.AddManoeuvreComment,
    (state, payload) => ({
      ...state,
      [payload.fieldName]: {
        ...state[payload.fieldName],
        [`${payload.controlOrObservation.toLocaleLowerCase()}FaultComments`]: payload.comment,
      },
    }),
  ),
  on(
    manoeuvresActions.AddManoeuvreSeriousFault,
    (state, { manoeuvrePayload }) => ({
      ...state,
      [manoeuvrePayload.manoeuvre]: {
        ...state[manoeuvrePayload.manoeuvre],
        [manoeuvrePayload.competency]: CompetencyOutcome.S,
      },
    }),
  ),
  on(
    manoeuvresActions.AddManoeuvreDangerousFault,
    (state, { manoeuvrePayload }) => ({
      ...state,
      [manoeuvrePayload.manoeuvre]: {
        ...state[manoeuvrePayload.manoeuvre],
        [manoeuvrePayload.competency]: CompetencyOutcome.D,
      },
    }),
  ),
  on(
    manoeuvresActions.RemoveManoeuvreFault,
    (state, { payload }) => {
      const {
        [payload.competency]: competencyToOmit, ...stateToPreserve
      } = state[payload.manoeuvre];
      return {
        ...state,
        [payload.manoeuvre]: stateToPreserve,
      };
    },
  ),
);
