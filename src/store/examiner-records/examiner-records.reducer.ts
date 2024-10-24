import { createFeatureSelector, createReducer, on } from '@ngrx/store';

import {
  CacheExaminerRecords,
  ColourFilterChanged,
  LoadingExaminerRecords,
  UpdateLastCached,
} from '@pages/examiner-records/examiner-records.actions';
import { ColourEnum } from '@providers/examiner-records/examiner-records';
import { UnloadExaminerRecords } from '@store/examiner-records/examiner-records.actions';
import { ExaminerRecordStateModel } from '@store/examiner-records/examiner-records.model';

export const examinerRecordsFeatureKey = 'examinerRecords';

export const initialState: ExaminerRecordStateModel = {
  cachedRecords: null,
  colourScheme: ColourEnum.DEFAULT,
  isLoading: false,
  lastUpdatedTime: null,
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
  on(LoadingExaminerRecords, (state: ExaminerRecordStateModel) => ({
    ...state,
    isLoading: true,
  })),
  on(ColourFilterChanged, (state: ExaminerRecordStateModel, { colour }) => ({
    ...state,
    colourScheme: colour,
  })),
  on(UnloadExaminerRecords, () => initialState)
);

export const getExaminerRecordsState = createFeatureSelector<ExaminerRecordStateModel>('examinerRecords');
