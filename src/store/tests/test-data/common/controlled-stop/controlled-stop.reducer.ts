import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as controlledStopActions from './controlled-stop.actions';
import { ControlledStopUnion } from '../../../../../app/shared/unions/test-schema-unions';
import { CompetencyOutcome } from '../../../../../app/shared/models/competency-outcome';

export const initialState: ControlledStopUnion = {};

export const controlledStopReducer = createReducer(
  initialState,
  on(controlledStopActions.ToggleControlledStop, (state): ControlledStopUnion => ({
    ...state,
    selected: !state.selected,
  })),
  on(controlledStopActions.ControlledStopAddDrivingFault, (state): ControlledStopUnion => ({
    ...state,
    fault: CompetencyOutcome.DF,
    selected: true,
  })),
  on(controlledStopActions.ControlledStopAddSeriousFault, (state): ControlledStopUnion => ({
    ...state,
    fault: CompetencyOutcome.S,
    selected: true,
  })),
  on(controlledStopActions.ControlledStopAddDangerousFault, (state): ControlledStopUnion => ({
    ...state,
    fault: CompetencyOutcome.D,
    selected: true,
  })),
  on(controlledStopActions.ControlledStopRemoveFault, (state): ControlledStopUnion => ({
    selected: state.selected,
  })),
  on(controlledStopActions.AddControlledStopComment, (state, { comment }): ControlledStopUnion => ({
    ...state,
    faultComments: comment,
  })),
);

export const getControlledStop = createFeatureSelector<ControlledStopUnion>('controlledStop');
