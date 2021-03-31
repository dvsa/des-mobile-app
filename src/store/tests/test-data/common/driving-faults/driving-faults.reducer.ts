import { DrivingFaults } from '@dvsa/mes-test-schema/categories/common';
import * as drivingFaultsActions from './driving-faults.actions';

export const initialState: DrivingFaults = {};

export function drivingFaultsReducer(
  state = initialState,
  action: drivingFaultsActions.Types,
): DrivingFaults {
  switch (action.type) {
    case drivingFaultsActions.ADD_DRIVING_FAULT:
      return {
        ...state,
        [action.payload.competency]: action.payload.newFaultCount,
      };
    case drivingFaultsActions.REMOVE_DRIVING_FAULT:
      if (action.payload.newFaultCount === 0) {
        const { [action.payload.competency]: removedDrivingFault, ...updatedDrivingFaults } = state;
        return {
          ...updatedDrivingFaults,
        };
      }
      return {
        ...state,
        [action.payload.competency]: action.payload.newFaultCount,
      };
    case drivingFaultsActions.ADD_DRIVING_FAULT_COMMENT:
      return {
        ...state,
        [`${action.competencyName}Comments`]: action.comment,
      };
    default:
      return state;
  }
}
