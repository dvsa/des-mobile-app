import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { createReducer, on } from '@ngrx/store';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import * as manoeuvresActions from './manoeuvres.actions';

export const initialState: [CatADI2UniqueTypes.Manoeuvres, CatADI2UniqueTypes.Manoeuvres] = [{}, {}];

export const manoeuvresCatADI2Reducer = createReducer(
  initialState,
  on(manoeuvresActions.RecordManoeuvresSelection, (state, {
    manoeuvre,
    index,
  }) => ([
    ...state.slice(0, index),
    ...[{
      [manoeuvre]: {
        ...state[index][manoeuvre],
        selected: true,
      },
    }],
    ...state.slice(index + 1),
  ]) as [CatADI2UniqueTypes.Manoeuvres, CatADI2UniqueTypes.Manoeuvres]),
  on(manoeuvresActions.RecordManoeuvresDeselection, (state, {
    index,
  }) => ([
    ...state.slice(0, index),
    ...[{}],
    ...state.slice(index + 1),
  ]) as [CatADI2UniqueTypes.Manoeuvres, CatADI2UniqueTypes.Manoeuvres]),
  on(manoeuvresActions.AddManoeuvreDrivingFault, (state, {
    payload,
    index,
  }) => ([
    ...state.slice(0, index),
    ...[{
      [payload.manoeuvre]: {
        ...state[index][payload.manoeuvre],
        [payload.competency]: CompetencyOutcome.DF,
      },
    }],
    ...state.slice(index + 1),
  ]) as [CatADI2UniqueTypes.Manoeuvres, CatADI2UniqueTypes.Manoeuvres]),
  on(manoeuvresActions.AddManoeuvreSeriousFault, (state, {
    payload,
    index,
  }) => ([
    ...state.slice(0, index),
    ...[{
      [payload.manoeuvre]: {
        ...state[index][payload.manoeuvre],
        [payload.competency]: CompetencyOutcome.S,
      },
    }],
    ...state.slice(index + 1),
  ]) as [CatADI2UniqueTypes.Manoeuvres, CatADI2UniqueTypes.Manoeuvres]),
  on(manoeuvresActions.AddManoeuvreDangerousFault, (state, {
    payload,
    index,
  }) => ([
    ...state.slice(0, index),
    ...[{
      [payload.manoeuvre]: {
        ...state[index][payload.manoeuvre],
        [payload.competency]: CompetencyOutcome.D,
      },
    }],
    ...state.slice(index + 1),
  ]) as [CatADI2UniqueTypes.Manoeuvres, CatADI2UniqueTypes.Manoeuvres]),
  on(manoeuvresActions.RemoveManoeuvreFault, (state, {
    payload,
    index,
  }) => {
    const {
      [payload.competency]: competencyToOmit,
      ...stateToPreserve
    } = state[index][payload.manoeuvre];

    return [
      ...state.slice(0, index),
      ...[{
        [payload.manoeuvre]: {
          ...stateToPreserve,
        },
      }],
      ...state.slice(index + 1),
    ] as [CatADI2UniqueTypes.Manoeuvres, CatADI2UniqueTypes.Manoeuvres];
  }),
  on(manoeuvresActions.AddManoeuvreComment, (state, {
    fieldName,
    controlOrObservation,
    comment,
    index,
  }) => ([
    ...state.slice(0, index),
    ...[{
      [fieldName]: {
        ...state[index][fieldName],
        [`${controlOrObservation.toLocaleLowerCase()}FaultComments`]: comment,
      },
    }],
    ...state.slice(index + 1),
  ]) as [CatADI2UniqueTypes.Manoeuvres, CatADI2UniqueTypes.Manoeuvres]),
);
