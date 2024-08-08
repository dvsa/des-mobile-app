import { createAction } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { ColourEnum, SelectableDateRange } from '@providers/examiner-records/examiner-records';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import {
  ExaminerReportsCardClick
} from '@pages/examiner-records/components/examiner-reports-card/examiner-reports-card';

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
  '[ExaminerRecordsPage] Get remote examiner records details',
  (staffNumber: string) => ({ staffNumber }),
);

export const ClickDataCard = createAction(
  '[ExaminerRecordsPage] Card has been clicked',
  (onClickData: ExaminerReportsCardClick) => ({ onClickData }),
);
export const CacheExaminerRecords = createAction(
  '[ExaminerRecordsPage] Cache remote examiner records details',
  (tests: ExaminerRecordModel[]) => ({ tests }),
);
export const UpdateLastCached = createAction(
  '[ExaminerRecordsPage] Updated examiner records last cached time',
  (time: string) => ({ time }),
);

export const LoadingExaminerRecords = createAction(
  '[ExaminerRecordsPage] Examiner records begins loading',
);

export const ReturnToDashboardPressed = createAction(
  '[ExaminerRecordsPage] Return to Dashboard button pressed',
);

export const DisplayPartialBanner = createAction(
  '[ExaminerRecordsPage] Examiner records partial banner displayed',
);

export const ColourFilterChanged = createAction(
  '[ExaminerRecordsPage] Colour filter changed',
  (colour: ColourEnum) => ({ colour }),
);

export const HideChartsChanged = createAction(
  '[ExaminerRecordsPage] Hide charts grids changed',
  (hideChart: boolean) => ({ hideChart: hideChart }),
);

export const NoExaminerRecordSetting = createAction(
  '[ExaminerRecordsPage] No Examiner record setting was found',
  (setting: string) => ({ setting }),
);
