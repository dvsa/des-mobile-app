import { AuthResult } from '@ionic-enterprise/auth';
import { createSelector } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { UserInfoStateModel } from '@store/user-info/user-info.model';

export const selectUserInfo = (state: StoreModel): UserInfoStateModel => state.userInfo;

export const getAuthResult = createSelector(
  selectUserInfo,
  (userInfo: UserInfoStateModel): AuthResult => userInfo.authResult
);

export const getEmployeeID = createSelector(
  selectUserInfo,
  (userInfo: UserInfoStateModel): string => userInfo.employeeId
);

export const getEmployeeName = createSelector(
  selectUserInfo,
  (userInfo: UserInfoStateModel): string => userInfo.employeeName
);
