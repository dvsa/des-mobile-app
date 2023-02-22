import { createAction } from '@ngrx/store';
import { RefDataTestCentreResponse } from '@providers/reference-data/reference-data';

export const SetDateRefDataUpdated = createAction(
  '[ReferenceDataEffects] Set date test centres loaded',
  (date: string) => ({ date }),
);

// Test centres
export const GetTestCentresRefData = createAction(
  '[ReferenceDataEffects] Get test centres',
);

export const LoadTestCentresRefDataSuccess = createAction(
  '[ReferenceDataEffects] Load test centres success',
  (testCentres: RefDataTestCentreResponse) => ({ testCentres }),
);

export const LoadTestCentresRefDataFail = createAction(
  '[ReferenceDataEffects] Load test centres failure',
);
