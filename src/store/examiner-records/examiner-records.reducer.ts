import { createFeatureSelector, createReducer, on } from '@ngrx/store';

import { ExaminerRecordStateModel } from '@store/examiner-records/examiner-records.model';
import { ColourEnum } from '@providers/examiner-records/examiner-records';
import {
  CacheExaminerRecords,
  ColourFilterChanged,
  DateRangeChanged,
  LoadingExaminerRecords,
  LocationChanged,
  HideChartsChanged,
  TestCategoryChanged,
  UpdateLastCached,
} from '@pages/examiner-records/examiner-records.actions';

export const examinerRecordsFeatureKey = 'examinerRecords';

export const initialState: ExaminerRecordStateModel = {
  cachedRecords: null,
  colourScheme: ColourEnum.DEFAULT,
  isLoading: false,
  lastUpdatedTime: null
};

export const examinerRecordsReducer = createReducer(
  initialState,
  on(UpdateLastCached, (state: ExaminerRecordStateModel, { time }) => ({
    ...state,
    lastUpdatedTime: time,
  })),
  on(CacheExaminerRecords, (state: ExaminerRecordStateModel, { tests }) => ({
    ...state,
    cachedRecords: tests,
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
    locationFilter: location,
  })),
  on(TestCategoryChanged, (state: ExaminerRecordStateModel, { testCategory }) => ({
    ...state,
    categoryFilter: testCategory,
  })),
  on(HideChartsChanged, (state: ExaminerRecordStateModel, { hideChart: showData }) => ({
    ...state,
    showData: showData,
  })),
);

export const getExaminerRecordsState = createFeatureSelector<ExaminerRecordStateModel>('examinerRecords');
