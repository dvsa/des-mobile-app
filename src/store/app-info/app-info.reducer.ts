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
import { ColourEnum } from '@pages/examiner-stats/examiner-stats.page';
import {
  ColourFilterChanged,
  DateRangeChanged,
  HideChartsChanged,
  LocationChanged, TestCategoryChanged,
} from '@pages/examiner-stats/examiner-stats.actions';

export const appInfoFeatureKey = 'appInfo';

export const initialState: AppInfoStateModel = {
  versionNumber: 'VERSION_NOT_LOADED',
  employeeId: null,
  employeeName: 'Unknown Name',
  updateAvailablePresented: null,
  examinerStats: {
    hideCharts: false,
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
  on(ColourFilterChanged, (state: AppInfoStateModel, { colour }) => ({
    ...state,
    examinerStats: {
      ...state.examinerStats,
      colourScheme: colour,
    },
  })),
  on(DateRangeChanged, (state: AppInfoStateModel, { selectedDate }) => ({
    ...state,
    examinerStats: {
      ...state.examinerStats,
      dateFilter: selectedDate,
    },
  })),
  on(LocationChanged, (state: AppInfoStateModel, { location }) => ({
    ...state,
    examinerStats: {
      ...state.examinerStats,
      locationFilter: location.centreId,
    },
  })),
  on(TestCategoryChanged, (state: AppInfoStateModel, { testCategory }) => ({
    ...state,
    examinerStats: {
      ...state.examinerStats,
      categoryFilter: testCategory,
    },
  })),
  on(HideChartsChanged, (state: AppInfoStateModel, { hideChart }) => ({
    ...state,
    examinerStats: {
      ...state.examinerStats,
      hideCharts: hideChart,
    },
  })),
);

export const getAppInfoState = createFeatureSelector<AppInfoStateModel>('appInfo');
