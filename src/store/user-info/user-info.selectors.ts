import { createSelector } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {UserInfoStateModel} from '@store/user-info/user-info.model';
import {AuthResult} from '@ionic-enterprise/auth';

export const selectAppInfo = (state: StoreModel): UserInfoStateModel => state.userInfo;

export const getAuthResult = createSelector(
  selectAppInfo,
  (userInfo: UserInfoStateModel): AuthResult => userInfo.authResult
);
