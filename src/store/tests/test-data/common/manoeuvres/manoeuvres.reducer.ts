import { createReducer, on } from '@ngrx/store';
import * as manoeuvresActions from './manoeuvres.actions';
import { ManoeuvreUnion } from '../../../../../app/shared/unions/test-schema-unions';
import { CompetencyOutcome } from '../../../../../app/shared/models/competency-outcome';

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
