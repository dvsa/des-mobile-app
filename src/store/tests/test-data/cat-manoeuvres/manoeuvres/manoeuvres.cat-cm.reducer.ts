import { CatC1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/C1EM';
import { CatC1MUniqueTypes } from '@dvsa/mes-test-schema/categories/C1M';
import { CatCEMUniqueTypes } from '@dvsa/mes-test-schema/categories/CEM';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { CatD1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/D1EM';
import { CatD1MUniqueTypes } from '@dvsa/mes-test-schema/categories/D1M';
import { CatDEMUniqueTypes } from '@dvsa/mes-test-schema/categories/DEM';
import { CatDMUniqueTypes } from '@dvsa/mes-test-schema/categories/DM';
import { createReducer, on } from '@ngrx/store';
import { CompetencyOutcome } from 'src/app/shared/models/competency-outcome';
import * as manoeuvresActions from '../../common/manoeuvres/manoeuvres.actions';

export type ManoeuvresCatManoeuvreUnion =
  | CatCMUniqueTypes.Manoeuvres
  | CatCEMUniqueTypes.Manoeuvres
  | CatC1MUniqueTypes.Manoeuvres
  | CatC1EMUniqueTypes.Manoeuvres
  | CatDMUniqueTypes.Manoeuvres
  | CatDEMUniqueTypes.Manoeuvres
  | CatD1MUniqueTypes.Manoeuvres
  | CatD1EMUniqueTypes.Manoeuvres;

export const initialState: ManoeuvresCatManoeuvreUnion = {
  reverseManoeuvre: {},
};

export const manoeuvresCatManoeuvreReducer = createReducer(
  initialState,
  on(manoeuvresActions.RecordManoeuvresSelection, (state, { manoeuvre }) => ({
    [manoeuvre]: {
      ...state[manoeuvre],
      selected: !state[manoeuvre].selected,
    },
  })),
  on(manoeuvresActions.AddManoeuvreComment, (state, payload) => ({
    ...state,
    [payload.fieldName]: {
      ...state[payload.fieldName],
      [`${payload.controlOrObservation.toLocaleLowerCase()}FaultComments`]: payload.comment,
    },
  })),
  on(manoeuvresActions.AddManoeuvreSeriousFault, (state, { manoeuvrePayload }) => ({
    ...state,
    [manoeuvrePayload.manoeuvre]: {
      ...state[manoeuvrePayload.manoeuvre],
      [manoeuvrePayload.competency]: CompetencyOutcome.S,
      selected: true,
    },
  })),
  on(manoeuvresActions.AddManoeuvreDangerousFault, (state, { manoeuvrePayload }) => ({
    ...state,
    [manoeuvrePayload.manoeuvre]: {
      ...state[manoeuvrePayload.manoeuvre],
      [manoeuvrePayload.competency]: CompetencyOutcome.D,
      selected: true,
    },
  })),
  on(manoeuvresActions.RemoveManoeuvreFault, (state, { payload }) => {
    const { [payload.competency]: competencyToOmit, ...stateToPreserve } = state[payload.manoeuvre];
    return {
      ...state,
      [payload.manoeuvre]: stateToPreserve,
    };
  })
);
