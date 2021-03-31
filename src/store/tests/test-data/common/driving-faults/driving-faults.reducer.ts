import { DrivingFaults } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import { omit } from 'lodash';
import * as drivingFaultsActions from './driving-faults.actions';

export const initialState: DrivingFaults = {};

export const drivingFaultsReducer = createReducer(
  initialState,
  on(drivingFaultsActions.AddDrivingFault, (state, { payload }): DrivingFaults => ({
    ...state,
    [payload.competency]: payload.newFaultCount,
  })),
  on(drivingFaultsActions.RemoveDrivingFault, (state, { payload }): DrivingFaults => {
    if (payload.newFaultCount === 0) {
      // not same as original implementation due to TS error
      return { ...omit(state, payload.competency) };
    }
    return {
      ...state,
      [payload.competency]: payload.newFaultCount,
    };
  }),
  on(drivingFaultsActions.AddDrivingFaultComment, (state, { competencyName, comment }): DrivingFaults => ({
    ...state,
    [`${competencyName}Comments`]: comment,
  })),
);
