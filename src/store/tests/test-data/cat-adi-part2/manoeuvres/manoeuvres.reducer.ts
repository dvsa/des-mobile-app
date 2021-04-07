import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { createReducer, on } from '@ngrx/store';
import * as manoeuvresActions from './manoeuvres.actions';
import { CompetencyOutcome } from '../../../../../app/shared/models/competency-outcome';

export const initialState: CatADI2UniqueTypes.Manoeuvres[] = [{}, {}];

export const manoeuvresCatADI2Reducer = createReducer(
  initialState,
  on(manoeuvresActions.RecordManoeuvresSelection, (state, {
    manoeuvre,
    index,
  }): CatADI2UniqueTypes.Manoeuvres[] => ([
    ...state.slice(0, index),
    ...[{
      [manoeuvre]: {
        ...state[index][manoeuvre],
        selected: true,
      },
    }],
    ...state.slice(index + 1),
  ])),
  on(manoeuvresActions.RecordManoeuvresDeselection, (state, {
    index,
  }): CatADI2UniqueTypes.Manoeuvres[] => ([
    ...state.slice(0, index),
    ...[{}],
    ...state.slice(index + 1),
  ])),
  on(manoeuvresActions.AddManoeuvreDrivingFault, (state, {
    payload,
    index,
  }): CatADI2UniqueTypes.Manoeuvres[] => ([
    ...state.slice(0, index),
    ...[{
      [payload.manoeuvre]: {
        ...state[index][payload.manoeuvre],
        [payload.competency]: CompetencyOutcome.DF,
      },
    }],
    ...state.slice(index + 1),
  ])),
  on(manoeuvresActions.AddManoeuvreSeriousFault, (state, {
    payload,
    index,
  }): CatADI2UniqueTypes.Manoeuvres[] => ([
    ...state.slice(0, index),
    ...[{
      [payload.manoeuvre]: {
        ...state[index][payload.manoeuvre],
        [payload.competency]: CompetencyOutcome.S,
      },
    }],
    ...state.slice(index + 1),
  ])),
  on(manoeuvresActions.AddManoeuvreDangerousFault, (state, {
    payload,
    index,
  }): CatADI2UniqueTypes.Manoeuvres[] => ([
    ...state.slice(0, index),
    ...[{
      [payload.manoeuvre]: {
        ...state[index][payload.manoeuvre],
        [payload.competency]: CompetencyOutcome.D,
      },
    }],
    ...state.slice(index + 1),
  ])),
  on(manoeuvresActions.RemoveManoeuvreFault, (state, {
    payload,
    index,
  }): CatADI2UniqueTypes.Manoeuvres[] => {
    const {
      [payload.competency]: competencyToOmit, ...stateToPreserve
    } = state[index][payload.manoeuvre];

    return [
      ...state.slice(0, index),
      ...[{
        [payload.manoeuvre]: {
          ...stateToPreserve,
        },
      }],
      ...state.slice(index + 1),
    ];
  }),
  on(manoeuvresActions.AddManoeuvreComment, (state, {
    fieldName,
    controlOrObservation,
    comment,
    index,
  }): CatADI2UniqueTypes.Manoeuvres[] => ([
    ...state.slice(0, index),
    ...[{
      [fieldName]: {
        ...state[index][fieldName],
        [`${controlOrObservation.toLocaleLowerCase()}FaultComments`]: comment,
      },
    }],
    ...state.slice(index + 1),
  ])),
);
