import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
  HasSeenUpdateAvailablePopup,
  LoadAppVersionFailure,
  LoadAppVersionSuccess,
  SetDateConfigLoaded,
  UnloadAppInfo,
  UpdateAuthResult,
  LoadEmployeeId,
  LoadEmployeeNameSuccess,
} from './app-info.actions';

import { AppInfoStateModel } from './app-info.model';

export const appInfoFeatureKey = 'appInfo';

export const initialState: AppInfoStateModel = {
  versionNumber: 'VERSION_NOT_LOADED',
  updateAvailablePresented: null,
  authResult: null,
  employeeId: null,
  employeeName: 'Unknown Name',
};

export const appInfoReducer = createReducer(
  initialState,
  on(LoadAppVersionSuccess, (state: AppInfoStateModel, { versionNumber }) => ({
    ...state,
    versionNumber,
  })),
  on(LoadAppVersionFailure, (state: AppInfoStateModel, { error }) => ({
    ...state,
    error,
  })),
  on(SetDateConfigLoaded, (state: AppInfoStateModel, { refreshDate }) => ({
    ...state,
    dateConfigLoaded: refreshDate,
  })),
  on(HasSeenUpdateAvailablePopup, (state: AppInfoStateModel, { hasSeen }) => ({
    ...state,
    updateAvailablePresented: hasSeen,
  })),
  on(UpdateAuthResult, (state: AppInfoStateModel, { authResult }) => ({
    ...state,
    authResult,
  })),
  on(LoadEmployeeId, (state: AppInfoStateModel, { employeeId }) => ({
    ...state,
    employeeId,
  })),
  on(LoadEmployeeNameSuccess, (state: AppInfoStateModel, { employeeName }) => ({
    ...state,
    employeeName,
  })),
  on(UnloadAppInfo, () => initialState)
);

export const getAppInfoState = createFeatureSelector<AppInfoStateModel>('appInfo');
