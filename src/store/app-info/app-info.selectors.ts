import { createSelector } from '@ngrx/store';
import { AppInfoStateModel } from './app-info.model';
import { StoreModel } from '../../app/shared/models/store.model';

export const selectAppInfo = (state: StoreModel): AppInfoStateModel => state.appInfo;

export const selectVersionNumber = createSelector(
  selectAppInfo,
  (appInfo: AppInfoStateModel): string => appInfo.versionNumber,
);

export const selectEmployeeId = createSelector(
  selectAppInfo,
  (appInfo: AppInfoStateModel): string => appInfo.employeeId,
);

export const selectEmployeeName = createSelector(
  selectAppInfo,
  (appInfo: AppInfoStateModel): string => appInfo.employeeName,
);

export const selectDateConfigLoaded = createSelector(
  selectAppInfo,
  (appInfo: AppInfoStateModel): string => appInfo.dateConfigLoaded,
);
