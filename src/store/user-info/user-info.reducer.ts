import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { LoadEmployeeId, LoadEmployeeNameSuccess, UnloadUserInfo, UpdateAuthResult } from './user-info.actions';

import { UserInfoStateModel } from './user-info.model';

export const userInfoFeatureKey = 'userInfo';

export const initialState: UserInfoStateModel = {
  authResult: null,
  employeeId: null,
  employeeName: 'Unknown Name',
};

export const userInfoReducer = createReducer(
  initialState,
  on(UpdateAuthResult, (state: UserInfoStateModel, { authResult }) => ({
    ...state,
    authResult,
  })),
  on(LoadEmployeeId, (state: UserInfoStateModel, { employeeId }) => ({
    ...state,
    employeeId,
  })),
  on(LoadEmployeeNameSuccess, (state: UserInfoStateModel, { employeeName }) => ({
    ...state,
    employeeName,
  })),
  on(UnloadUserInfo, () => initialState)
);

export const getUserInfoState = createFeatureSelector<UserInfoStateModel>('userInfo');
