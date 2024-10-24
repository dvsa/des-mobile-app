import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { createReducer, on } from '@ngrx/store';
import { CompetencyOutcome } from 'src/app/shared/models/competency-outcome';
import * as manoeuvresActions from '../../common/manoeuvres/manoeuvres.actions';

export const initialState: CatBUniqueTypes.Manoeuvres = {};

export const manoeuvresReducer = createReducer(
  initialState,
  on(manoeuvresActions.RecordManoeuvresSelection, (state, { manoeuvre }) => ({
    [manoeuvre]: {
      ...state[manoeuvre],
      selected: true,
    },
  })),
  on(manoeuvresActions.AddManoeuvreDrivingFault, (state, { manoeuvrePayload }) => ({
    ...state,
    [manoeuvrePayload.manoeuvre]: {
      ...state[manoeuvrePayload.manoeuvre],
      [manoeuvrePayload.competency]: CompetencyOutcome.DF,
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
    },
  })),
  on(manoeuvresActions.AddManoeuvreDangerousFault, (state, { manoeuvrePayload }) => ({
    ...state,
    [manoeuvrePayload.manoeuvre]: {
      ...state[manoeuvrePayload.manoeuvre],
      [manoeuvrePayload.competency]: CompetencyOutcome.D,
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
