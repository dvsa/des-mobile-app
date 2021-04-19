import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { PcvDoorExerciseTypes } from '@providers/fault-summary/cat-d/fault-summary.cat-d';
import * as pcvDoorExerciseActions from './pcv-door-exercise.actions';

export const initialState: PcvDoorExerciseTypes = {
  dangerousFault: null,
  seriousFault: null,
  drivingFault: null,
  dangerousFaultComments: null,
  seriousFaultComments: null,
  drivingFaultComments: null,
};

export const pcvDoorExerciseReducer = createReducer(
  initialState,
  on(pcvDoorExerciseActions.PcvDoorExerciseAddDrivingFault, (state) => ({
    ...state,
    drivingFault: true,
  })),

  on(pcvDoorExerciseActions.PcvDoorExerciseAddSeriousFault, (state) => ({
    ...state,
    seriousFault: true,
  })),

  on(pcvDoorExerciseActions.PcvDoorExerciseAddDangerousFault, (state) => ({
    ...state,
    dangerousFault: true,
  })),

  on(pcvDoorExerciseActions.PcvDoorExerciseRemoveDrivingFault, (state) => ({
    ...state,
    drivingFault: false,
  })),

  on(pcvDoorExerciseActions.PcvDoorExerciseRemoveSeriousFault, (state) => ({
    ...state,
    seriousFault: false,
  })),

  on(pcvDoorExerciseActions.PcvDoorExerciseRemoveDangerousFault, (state) => ({
    ...state,
    dangerousFault: false,
  })),

  on(pcvDoorExerciseActions.AddPcvDoorExerciseComment, (state, { fieldName, comment }) => ({
    ...state,
    [fieldName]: comment,
  })),

);

export const getPcvDoorExercise = createFeatureSelector<PcvDoorExerciseTypes>('pcvDoorExercise');
