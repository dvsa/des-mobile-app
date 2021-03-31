import { ControlledStopUnion } from '../../../../../shared/unions/test-schema-unions';
import * as controlledStopActions from './controlled-stop.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: ControlledStopUnion = {};

export function controlledStopReducer(
  state = initialState,
  action: controlledStopActions.Types,
): ControlledStopUnion {
  switch (action.type) {
    case controlledStopActions.TOGGLE_CONTROLLED_STOP:
      return {
        ...state,
        selected: !state.selected,
      };
    case controlledStopActions.CONTROLLED_STOP_ADD_DRIVING_FAULT:
      return {
        ...state,
        fault: CompetencyOutcome.DF,
        selected: true,
      };
    case controlledStopActions.CONTROLLED_STOP_ADD_SERIOUS_FAULT:
      return {
        ...state,
        fault: CompetencyOutcome.S,
        selected: true,
      };
    case controlledStopActions.CONTROLLED_STOP_ADD_DANGEROUS_FAULT:
      return {
        ...state,
        fault: CompetencyOutcome.D,
        selected: true,
      };
    case controlledStopActions.CONTROLLED_STOP_REMOVE_FAULT:
      return {
        selected: state.selected,
      };
    case controlledStopActions.ADD_CONTROLLED_STOP_COMMENT:
      return {
        ...state,
        faultComments: action.comment,
      };
    default:
      return state;
  }
}

export const getControlledStop = createFeatureSelector<ControlledStopUnion>('controlledStop');
