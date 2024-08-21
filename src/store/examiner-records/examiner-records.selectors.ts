import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { createSelector } from '@ngrx/store';
import { ColourEnum } from '@providers/examiner-records/examiner-records';
import { StoreModel } from '@shared/models/store.model';
import { ExaminerRecordStateModel } from '@store/examiner-records/examiner-records.model';

export const selectExaminerRecords = (state: StoreModel): ExaminerRecordStateModel => state.examinerRecords;

export const selectCachedExaminerRecords = createSelector(
  selectExaminerRecords,
  (examinerRecords): ExaminerRecordModel[] => examinerRecords.cachedRecords
);
export const selectLastCachedDate = createSelector(
  selectExaminerRecords,
  (examinerRecords): string => examinerRecords.lastUpdatedTime
);
export const getIsLoadingRecords = createSelector(
  selectExaminerRecords,
  (examinerRecords): boolean => examinerRecords.isLoading
);
export const selectColourScheme = createSelector(
  selectExaminerRecords,
  (examinerRecords): ColourEnum => examinerRecords.colourScheme
);
