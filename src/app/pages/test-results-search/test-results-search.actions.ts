import { createAction } from '@ngrx/store';
import { AdvancedSearchParams } from '@providers/search/search.models';

export const TestResultSearchViewDidEnter = createAction('[TestResultSearch] Test Result Search Did Enter');

export const PerformApplicationReferenceSearch = createAction(
  '[TestResultSearch] Performed an application reference search'
);

export const PerformDriverNumberSearch = createAction('[TestResultSearch] Performed a driver number search');

export const TestCentreSelected = createAction('[TestResultSearch] Selected a test centre');
export const StaffNumberChanged = createAction('[TestResultSearch] Entered a staff number');
export const StartDateChanged = createAction('[TestResultSearch] Changed the start date');
export const EndDateChanged = createAction('[TestResultSearch] Changed the end date');
export const ActivityCodeChanged = createAction('[TestResultSearch] Changed the activity code');
export const TestCategoryChanged = createAction('[TestResultSearch] Changed the test category');
export const PassCertificateChanged = createAction('[TestResultSearch] Changed the pass certificate number');
export const RekeyBoxToggled = createAction('[TestResultSearch] Toggled the rekey box', (isActive: boolean) => ({
  isActive,
}));

export const PerformLDTMSearch = createAction(
  '[TestResultSearch] Performed a LDTM search',
  (advancedSearchParams: AdvancedSearchParams) => ({ advancedSearchParams })
);
