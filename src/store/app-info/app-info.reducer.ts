import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
  HasSeenUpdateAvailablePopup,
  LoadAppVersionFailure,
  LoadAppVersionSuccess,
  LoadEmployeeId,
  LoadEmployeeNameSuccess,
  SetDateConfigLoaded,
} from './app-info.actions';

import { AppInfoStateModel } from './app-info.model';
import {
  ColourFilterChanged,
  DateRangeChanged,
  ShowDataChanged,
  LocationChanged,
  TestCategoryChanged,
  CacheTests,
} from '@pages/examiner-records/examiner-records.actions';
import { ColourEnum } from '@pages/examiner-records/examiner-records.page';

export const appInfoFeatureKey = 'appInfo';

export const initialState: AppInfoStateModel = {
  versionNumber: 'VERSION_NOT_LOADED',
  employeeId: null,
  employeeName: 'Unknown Name',
  updateAvailablePresented: null,
  examinerRecords: {
    cachedTests: null,
    showData: false,
    colourScheme: ColourEnum.Default,
    dateFilter: null,
    locationFilter: null,
    categoryFilter: null,
  },
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
  on(HasSeenUpdateAvailablePopup, (state: AppInfoStateModel, { hasSeen }) => ({
    ...state,
    updateAvailablePresented: hasSeen,
  })),
  on(CacheTests, (state: AppInfoStateModel, { tests }) => ({
    ...state,
    examinerRecords: {
      ...state.examinerRecords,
      cachedTests: tests,
    },
  })),
  on(ColourFilterChanged, (state: AppInfoStateModel, { colour }) => ({
    ...state,
    examinerRecords: {
      ...state.examinerRecords,
      colourScheme: colour,
    },
  })),
  on(DateRangeChanged, (state: AppInfoStateModel, { selectedDate }) => ({
    ...state,
    examinerRecords: {
      ...state.examinerRecords,
      dateFilter: selectedDate,
    },
  })),
  on(LocationChanged, (state: AppInfoStateModel, { location }) => ({
    ...state,
    examinerRecords: {
      ...state.examinerRecords,
      locationFilter: location?.centreId,
    },
  })),
  on(TestCategoryChanged, (state: AppInfoStateModel, { testCategory }) => ({
    ...state,
    examinerRecords: {
      ...state.examinerRecords,
      categoryFilter: testCategory,
    },
  })),
  on(ShowDataChanged, (state: AppInfoStateModel, { hideChart: showData }) => ({
    ...state,
    examinerRecords: {
      ...state.examinerRecords,
      showData: showData,
    },
  })),
);

export const getAppInfoState = createFeatureSelector<AppInfoStateModel>('appInfo');
