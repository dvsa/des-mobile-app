import { createAction } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { ColourEnum, SelectableDateRange } from '@providers/examiner-records/examiner-records';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';

export const ExaminerRecordsViewDidEnter = createAction(
  '[ExaminerRecordsPage] Page Entered',
);

export const DateRangeChanged = createAction(
  '[ExaminerRecordsPage] Date range changed',
  (selectedDate: SelectableDateRange) => ({ selectedDate }),
);

export const LocationChanged = createAction(
  '[ExaminerRecordsPage] Location changed',
  (location: TestCentre) => ({ location }),
);

export const TestCategoryChanged = createAction(
  '[ExaminerRecordsPage] Test category changed',
  (testCategory: TestCategory) => ({ testCategory }),
);

export const GetExaminerRecords = createAction(
  '[ExaminerRecordsPage] Call backend tests',
  (staffNumber: string) => ({ staffNumber }),
);
export const CacheExaminerRecords = createAction(
  '[ExaminerRecordsPage] Cache backend tests',
  (tests: ExaminerRecordModel[]) => ({ tests }),
);
export const UpdateLastCached = createAction(
  '[ExaminerRecordsPage] Updated examiner records last cached time',
  (time: string) => ({ time }),
);
export const LoadingExaminerRecords = createAction(
  '[ExaminerRecordsPage] Examiner records begins loading',
);

export const ColourFilterChanged = createAction(
  '[ExaminerRecordsPage] Colour filter changed',
  (colour: ColourEnum) => ({ colour }),
);

export const HideChartsChanged = createAction(
  '[ExaminerRecordsPage] Hide charts grids changed',
  (hideChart: boolean) => ({ hideChart: hideChart }),
);
export const AccordionChanged = createAction(
  '[ExaminerRecordsPage] Accordion toggled',
  (isOpen: boolean) => ({ isOpen }),
);
export const NoExaminerRecordSetting = createAction(
  '[ExaminerRecordsPage] No Examiner record setting was found',
  (setting: string) => ({ setting }),
);
