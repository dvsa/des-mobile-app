import { createReducer, createFeatureSelector, on } from '@ngrx/store';
import {
  LoadAppVersionFailure,
  LoadAppVersionSuccess,
  LoadEmployeeId,
  LoadEmployeeNameSuccess,
  SetDateConfigLoaded,
} from './app-info.actions';

import { AppInfoStateModel } from '../../types/app-info.model';

export const appInfoFeatureKey = 'appInfo';

export const initialState: AppInfoStateModel = {
  versionNumber: 'VERSION_NOT_LOADED',
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
  on(LoadEmployeeId, (state: AppInfoStateModel, { employeeId }) => ({
    ...state,
    employeeId,
  })),
  on(LoadEmployeeNameSuccess, (state: AppInfoStateModel, { employeeName }) => ({
    ...state,
    employeeName,
  })),
  on(SetDateConfigLoaded, (state: AppInfoStateModel, { refreshDate }) => ({
    ...state,
    dateConfigLoaded: refreshDate,
  })),
);

export const getAppInfoState = createFeatureSelector<AppInfoStateModel>('appInfo');
