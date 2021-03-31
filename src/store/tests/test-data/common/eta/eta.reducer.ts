import { ETA } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import * as etaActions from './eta.actions';

export const initialState: ETA = {};

export const etaReducer = createReducer(
  initialState,
  on(etaActions.ToggleETA, (state, { payload }) => ({
    ...state,
    [payload]: !state[payload],
  })),
);
