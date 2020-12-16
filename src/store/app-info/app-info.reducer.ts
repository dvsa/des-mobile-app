import { createReducer, on } from '@ngrx/store';
import {
  LoadAppInfoFailure,
  LoadAppInfoSuccess,
  LoadEmployeeId,
  LoadEmployeeNameSuccess,
  SetDateConfigLoaded,
} from './app-info.actions';

import { AppInfoModel } from './app-info.model';

export const appInfoFeatureKey = 'appInfo';

export const initialState: AppInfoModel = {
  versionNumber: 'VERSION_NOT_LOADED',
  employeeId: null,
  employeeName: 'Unknown Name',
};

export const reducer = createReducer(
  initialState,
  on(LoadAppInfoSuccess, (state: AppInfoModel, { versionNumber }) => ({
    ...state,
    versionNumber,
  })),
  on(LoadAppInfoFailure, (state: AppInfoModel, { error }) => ({
    ...state,
    error,
  })),
  on(LoadEmployeeId, (state: AppInfoModel, { employeeId }) => ({
    ...state,
    employeeId,
  })),
  on(LoadEmployeeNameSuccess, (state: AppInfoModel, { employeeName }) => ({
    ...state,
    employeeName,
  })),
  on(SetDateConfigLoaded, (state: AppInfoModel, { refreshDate }) => ({
    ...state,
    dateConfigLoaded: refreshDate,
  })),
);
