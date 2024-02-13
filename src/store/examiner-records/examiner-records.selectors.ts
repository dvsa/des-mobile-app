import { createSelector } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ColourEnum, SelectableDateRange } from '@providers/examiner-records/examiner-records';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ExaminerRecordStateModel } from '@store/examiner-records/examiner-records.model';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';

export const selectExaminerRecords = (state: StoreModel): ExaminerRecordStateModel => state.examinerRecords;

export const selectCachedExaminerRecords = createSelector(
  selectExaminerRecords,
  (examinerRecords): ExaminerRecordModel[] => examinerRecords.cachedRecords,
);
export const selectLastCachedDate = createSelector(
  selectExaminerRecords,
  (examinerRecords): string => examinerRecords.lastUpdatedTime,
);
export const getIsLoadingRecords = createSelector(
  selectExaminerRecords,
  (examinerRecords): boolean => examinerRecords.isLoading,
);
export const selectColourScheme = createSelector(
  selectExaminerRecords,
  (examinerRecords): ColourEnum => examinerRecords.colourScheme,
);

export const selectShowData = createSelector(
  selectExaminerRecords,
  (examinerRecords): boolean => examinerRecords.showData,
);
export const selectDateFilter = createSelector(
  selectExaminerRecords,
  (examinerRecords): SelectableDateRange => examinerRecords.dateFilter,
);
export const selectCategoryFilter = createSelector(
  selectExaminerRecords,
  (examinerRecords): TestCategory => examinerRecords.categoryFilter,
);
export const selectLocationFilter = createSelector(
  selectExaminerRecords,
  (examinerRecords): number => examinerRecords.locationFilter.centreId,
);

