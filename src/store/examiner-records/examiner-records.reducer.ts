import { createFeatureSelector, createReducer, on } from '@ngrx/store';

import { ExaminerRecordStateModel } from '@store/examiner-records/examiner-records.model';
import { ColourEnum } from '@providers/examiner-records/examiner-records';
import {
  CacheTests,
  ColourFilterChanged, DateRangeChanged,
  LoadingExaminerRecords, LocationChanged, ShowDataChanged, TestCategoryChanged, UpdateLastCached,
} from '@pages/examiner-records/examiner-records.actions';

export const examinerRecordsFeatureKey = 'examinerRecords';

export const initialState: ExaminerRecordStateModel = {
  cachedTests: null,
  showData: false,
  colourScheme: ColourEnum.Default,
  dateFilter: null,
  locationFilter: null,
  categoryFilter: null,
  isLoading: false,
  lastUpdatedTime: null
};

export const examinerRecordsReducer = createReducer(
  initialState,
  on(UpdateLastCached, (state: ExaminerRecordStateModel, { time }) => ({
    ...state,
    lastUpdatedTime: time,
  })),
  on(CacheTests, (state: ExaminerRecordStateModel, { tests }) => ({
    ...state,
    cachedTests: tests,
    isLoading: false,
  })),
  on(LoadingExaminerRecords, (state: ExaminerRecordStateModel, { }) => ({
    ...state,
    isLoading: true,
  })),
  on(ColourFilterChanged, (state: ExaminerRecordStateModel, { colour }) => ({
    ...state,
    colourScheme: colour,
  })),
  on(DateRangeChanged, (state: ExaminerRecordStateModel, { selectedDate }) => ({
    ...state,
    dateFilter: selectedDate,
  })),
  on(LocationChanged, (state: ExaminerRecordStateModel, { location }) => ({
    ...state,
    locationFilter: location?.centreId,
  })),
  on(TestCategoryChanged, (state: ExaminerRecordStateModel, { testCategory }) => ({
    ...state,
    categoryFilter: testCategory,
  })),
  on(ShowDataChanged, (state: ExaminerRecordStateModel, { hideChart: showData }) => ({
    ...state,
    showData: showData,
  })),
);

export const getExaminerRecordsState = createFeatureSelector<ExaminerRecordStateModel>('examinerRecords');
