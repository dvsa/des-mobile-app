import { createSelector } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AppInfoStateModel } from './app-info.model';
import { ColourEnum, SelectableDateRange } from '@pages/examiner-records/examiner-records.page';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

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

export const selectUpdateAvailablePresented = createSelector(
  selectAppInfo,
  (appInfo: AppInfoStateModel): boolean => appInfo.updateAvailablePresented,
);

export const selectExaminerRecords = createSelector(
  selectAppInfo,
  (appInfo: AppInfoStateModel) => appInfo.examinerRecords,
);

export const selectCachedTests = createSelector(
  selectAppInfo,
  selectExaminerRecords,
  (_, examinerRecords): string => examinerRecords.cachedTests,
);
export const selectColourScheme = createSelector(
  selectAppInfo,
  selectExaminerRecords,
  (_, examinerRecords): ColourEnum => examinerRecords.colourScheme,
);

export const selectHideCharts = createSelector(
  selectAppInfo,
  selectExaminerRecords,
  (_, examinerRecords): boolean => examinerRecords.showData,
);
export const selectDateFilter = createSelector(
  selectAppInfo,
  selectExaminerRecords,
  (_, examinerRecords): SelectableDateRange => examinerRecords.dateFilter,
);
export const selectCategoryFilter = createSelector(
  selectAppInfo,
  selectExaminerRecords,
  (_, examinerRecords): TestCategory => examinerRecords.categoryFilter,
);
export const selectLocationFilter = createSelector(
  selectAppInfo,
  selectExaminerRecords,
  (_, examinerRecords): number => examinerRecords.locationFilter,
);
