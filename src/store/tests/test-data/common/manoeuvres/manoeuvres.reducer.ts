import { createReducer, on } from '@ngrx/store';
import { ManoeuvreUnion } from '@shared/unions/test-schema-unions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import * as manoeuvresActions from './manoeuvres.actions';

export const initialState: ManoeuvreUnion = {
  reverseLeft: {},
};

export const manoeuvresReducer = createReducer(
  initialState,
  on(manoeuvresActions.RecordManoeuvresSelection, (state, { manoeuvre }) => ({
    [manoeuvre]: {
      ...state[manoeuvre],
      selected: true,
    },
  })),
  on(manoeuvresActions.RecordManoeuvresDeselection, (state, { manoeuvre }) => ({
    [manoeuvre]: {
      ...state[manoeuvre],
      selected: false,
    },
  })),
  on(manoeuvresActions.AddManoeuvreDrivingFault, (state, { manoeuvrePayload }) => ({
    ...state,
    [manoeuvrePayload.manoeuvre]: {
      ...state[manoeuvrePayload.manoeuvre],
      selected: true,
      [manoeuvrePayload.competency]: CompetencyOutcome.DF,
    },
  })),
  on(manoeuvresActions.AddManoeuvreSeriousFault, (state, { manoeuvrePayload }) => ({
    ...state,
    [manoeuvrePayload.manoeuvre]: {
      ...state[manoeuvrePayload.manoeuvre],
      selected: true,
      [manoeuvrePayload.competency]: CompetencyOutcome.S,
    },
  })),
  on(manoeuvresActions.AddManoeuvreDangerousFault, (state, { manoeuvrePayload }) => ({
    ...state,
    [manoeuvrePayload.manoeuvre]: {
      ...state[manoeuvrePayload.manoeuvre],
      selected: true,
      [manoeuvrePayload.competency]: CompetencyOutcome.D,
    },
  })),
  on(manoeuvresActions.AddManoeuvreComment, (state, {
    fieldName,
    controlOrObservation,
    comment,
  }) => ({
    ...state,
    [fieldName]: {
      ...state[fieldName],
      [`${controlOrObservation.toLocaleLowerCase()}FaultComments`]: comment,
    },
  })),
  on(manoeuvresActions.RemoveManoeuvreFault, (state, { payload }) => {
    const {
      [payload.competency]: competencyToOmit, ...stateToPreserve
    } = state[payload.manoeuvre];
    return {
      ...state,
      [payload.manoeuvre]: stateToPreserve,
    };
  }),
);
