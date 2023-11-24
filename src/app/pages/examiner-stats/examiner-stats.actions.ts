import { createAction } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ColourEnum, SelectableDateRange } from '@pages/examiner-stats/examiner-stats.page';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';

export const ExaminerStatsViewDidEnter = createAction(
  '[ExaminerStatsPage] Page Entered',
);

export const DateRangeChanged = createAction(
  '[ExaminerStatsPage] Date range changed',
  (selectedDate: SelectableDateRange) => ({ selectedDate }),
);

export const LocationChanged = createAction(
  '[ExaminerStatsPage] Location changed',
  (location: TestCentre) => ({ location }),
);

export const TestCategoryChanged = createAction(
  '[ExaminerStatsPage] Test category changed',
  (testCategory: TestCategory) => ({ testCategory }),
);

export const ColourFilterChanged = createAction(
  '[ExaminerStatsPage] Colour filter changed',
  (colour: ColourEnum) => ({ colour }),
);

export const HideChartsChanged = createAction(
  '[ExaminerStatsPage] Hide charts changed',
  (hideChart: boolean) => ({ hideChart }),
);
export const AccordionChanged = createAction(
  '[ExaminerStatsPage] Accordion toggled',
  (isOpen: boolean) => ({ isOpen }),
);
