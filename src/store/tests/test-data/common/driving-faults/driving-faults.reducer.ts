import { DrivingFaults } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import { omit } from 'lodash';
import * as drivingFaultsActions from './driving-faults.actions';

export const initialState: DrivingFaults = {};

export const drivingFaultsReducer = createReducer(
  initialState,
  on(drivingFaultsActions.AddDrivingFault, (state, { faultPayload }): DrivingFaults => ({
    ...state,
    [faultPayload.competency]: faultPayload.newFaultCount,
  })),
  on(drivingFaultsActions.RemoveDrivingFault, (state, { faultPayload }): DrivingFaults => {
    if (faultPayload.newFaultCount === 0) {
      // not same as original implementation due to TS error
      return { ...omit(state, faultPayload.competency) };
    }
    return {
      ...state,
      [faultPayload.competency]: faultPayload.newFaultCount,
    };
  }),
  on(drivingFaultsActions.AddDrivingFaultComment, (state, { competencyName, comment }): DrivingFaults => ({
    ...state,
    [`${competencyName}Comments`]: comment,
  })),
);
