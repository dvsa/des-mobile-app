import { createAction } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ColourEnum } from '@pages/examiner-stats/examiner-stats.page';

export const ExaminerStatsViewDidEnter = createAction(
  '[ExaminerStatsPage] Page Entered',
);

export const DateRangeChanged = createAction(
  '[ExaminerStatsPage] Date range changed',
  (range: string) => ({ range }),
);

export const LocationChanged = createAction(
  '[ExaminerStatsPage] Location changed',
  (location: string) => ({ location }),
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
