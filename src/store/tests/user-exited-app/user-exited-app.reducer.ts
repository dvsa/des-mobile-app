import { UserExitedApp } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as userExitedAppActions from './user-exited-app.actions';

export const initialState: UserExitedApp = {
  exitFlag: false,
};

export const userExitedAppReducer = createReducer(
  initialState,
  on(userExitedAppActions.SetHasExitedApp, (state: UserExitedApp) => ({
    ...state,
    exitFlag: true,
  })),
  on(userExitedAppActions.SetHasNotExitedApp, (state: UserExitedApp) => ({
    ...state,
    exitFlag: false,
  })),
  on(userExitedAppActions.SetReasonForExitingApp, (state: UserExitedApp, { reason }) => ({
    ...state,
    exitReason: reason,
  }))
);

export const getUserExitedApp = createFeatureSelector<UserExitedApp>('userExitedApp');
