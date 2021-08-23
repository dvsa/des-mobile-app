import { createAction, union } from '@ngrx/store';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { HttpErrorResponse } from '@angular/common/http';

import { RekeySearchError } from './rekey-search-error-model';

export const RekeySearchViewDidEnter = createAction(
  '[RekeySearch] Rekey Search Did Enter',
);

export const SearchBookedTest = createAction(
  '[RekeySearch] Search Booked Test',
  (appRef: string, staffNumber: string) => ({ appRef, staffNumber }),
);

export const SearchBookedTestSuccess = createAction(
  '[RekeySearchEffects] Search Booked Test Success',
  (testSlot: TestSlot, staffNumber: string) => ({ testSlot, staffNumber }),
);

export const SearchBookedTestFailure = createAction(
  '[RekeySearchEffects] Search Booked Test Failure',
  (err: HttpErrorResponse | RekeySearchError) => ({ err }),
);

export const RekeySearchClearState = createAction(
  '[RekeySearch] Rekey Search Clear State',
);

const actions = union({
  RekeySearchViewDidEnter,
  SearchBookedTest,
  SearchBookedTestSuccess,
  SearchBookedTestFailure,
  RekeySearchClearState,
});

export type RekeySearchActions = typeof actions;
