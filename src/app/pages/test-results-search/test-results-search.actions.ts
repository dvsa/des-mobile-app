import { createAction } from '@ngrx/store';
import { AdvancedSearchParams } from '@providers/search/search.models';

export const TestResultSearchViewDidEnter = createAction(
  '[TestResultSearch] Test Result Search Did Enter',
);

export const PerformApplicationReferenceSearch = createAction(
  '[TestResultSearch] Performed an application reference search',
);

export const PerformDriverNumberSearch = createAction(
  '[TestResultSearch] Performed a driver number search',
);

export const PerformLDTMSearch = createAction(
  '[TestResultSearch] Performed a LDTM search',
  (advancedSearchParams: AdvancedSearchParams) => ({ advancedSearchParams }),
);
