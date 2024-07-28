import { HttpErrorResponse } from '@angular/common/http';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { createAction, union } from '@ngrx/store';
import { DelegatedExaminerTestSlot } from '@providers/delegated-rekey-search/mock-data/delegated-mock-data';
import { DelegatedRekeySearchError } from './delegated-rekey-search-error-model';

export const DelegatedRekeySearchViewDidEnter = createAction('[DelegatedRekeySearch] Delegated Rekey Search Did Enter');

export const SearchBookedDelegatedTest = createAction(
  '[DelegatedRekeySearch] Search Booked Test',
  (appRef: string) => ({ appRef })
);

export const SearchBookedDelegatedTestSuccess = createAction(
  '[DelegatedRekeySearchEffects] Search Booked Test Success',
  (testSlot: TestSlot | DelegatedExaminerTestSlot) => ({ testSlot })
);

export const SearchBookedDelegatedTestFailure = createAction(
  '[DelegatedRekeySearchEffects] Search Booked Test Failure',
  (err: HttpErrorResponse | DelegatedRekeySearchError) => ({ err })
);

export const DelegatedRekeySearchClearState = createAction('[DelegatedRekeySearch] Delegated Rekey Search Clear State');

const actions = union({
  DelegatedRekeySearchViewDidEnter,
  SearchBookedDelegatedTest,
  SearchBookedDelegatedTestSuccess,
  SearchBookedDelegatedTestFailure,
  DelegatedRekeySearchClearState,
});

export type DelegatedRekeySearchActions = typeof actions;
