import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
  UpdateAuthResult, UnloadUserInfo
} from './user-info.actions';

import { UserInfoStateModel} from './user-info.model';

export const userInfoFeatureKey = 'userInfo';

export const initialState: UserInfoStateModel = {
  authResult: null,
};

export const userInfoReducer = createReducer(
  initialState,
  on(UpdateAuthResult, (state: UserInfoStateModel, { authResult }) => ({
    ...state,
    authResult,
  })),
  on(UnloadUserInfo, () => initialState)
);

export const getUserInfoState = createFeatureSelector<UserInfoStateModel>('userInfo');
