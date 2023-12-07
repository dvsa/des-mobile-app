import { createAction } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ColourEnum, SelectableDateRange } from '@pages/examiner-records/examiner-records.page';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';

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

export const ColourFilterChanged = createAction(
  '[ExaminerRecordsPage] Colour filter changed',
  (colour: ColourEnum) => ({ colour }),
);

export const ShowDataChanged = createAction(
  '[ExaminerRecordsPage] Show data grids changed',
  (showData: boolean) => ({ hideChart: showData }),
);
export const AccordionChanged = createAction(
  '[ExaminerRecordsPage] Accordion toggled',
  (isOpen: boolean) => ({ isOpen }),
);
