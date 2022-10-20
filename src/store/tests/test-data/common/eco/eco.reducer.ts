import { Eco } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import * as ecoActions from './eco.actions';

export const initialState: Eco = {};

export const ecoReducer = createReducer(
  initialState,
  on(ecoActions.ToggleEco, (state): Eco => ({
    ...state,
    completed: !state.completed,
  })),
  on(ecoActions.ToggleControlEco, (state): Eco => ({
    ...state,
    adviceGivenControl: !state.adviceGivenControl,
  })),
  on(ecoActions.TogglePlanningEco, (state): Eco => ({
    ...state,
    adviceGivenPlanning: !state.adviceGivenPlanning,
  })),
  on(ecoActions.ToggleFuelEfficientDriving, (state, { fuelEfficientDriving }): Eco => ({
    ...state,
    fuelEfficientDriving,
  })),
  on(ecoActions.AddEcoRelatedFault, (state, { ecoRelatedFault }): Eco => ({
    ...state,
    ecoRelatedFault,
  })),
  on(ecoActions.AddEcoCaptureReason, (state, { ecoCaptureReason }): Eco => ({
    ...state,
    ecoCaptureReason,
  })),
);
