import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { HttpErrorResponse } from '@angular/common/http';
import * as delegatedRekeySearchActions from './delegated-rekey-search.actions';
import * as testActions from '../../../store/tests/tests.actions';
import { DelegatedRekeySearchError, DelegatedRekeySearchErrorMessages } from './delegated-rekey-search-error-model';

export type DelegatedRekeySearchModel = {
  isLoading: boolean,
  hasSearched: boolean,
  bookedTestSlot: TestSlot,
  err: DelegatedRekeySearchError | HttpErrorResponse,
};

export const initialState: DelegatedRekeySearchModel = {
  isLoading: false,
  hasSearched: false,
  bookedTestSlot: {},
  err: {
    message: '' as DelegatedRekeySearchErrorMessages,
  },
};

export const delegatedSearchReducer = createReducer(
  initialState,
  on(delegatedRekeySearchActions.DelegatedRekeySearchClearState, () => ({
    ...initialState,
  })),
  on(delegatedRekeySearchActions.SearchBookedDelegatedTest, (state) => ({
    ...state,
    bookedTestSlot: {},
    isLoading: true,
    hasSearched: false,
  })),
  on(delegatedRekeySearchActions.SearchBookedDelegatedTestSuccess, (state, { testSlot }) => ({
    ...state,
    bookedTestSlot: testSlot,
    isLoading: false,
    hasSearched: true,
  })),
  on(delegatedRekeySearchActions.SearchBookedDelegatedTestFailure, (state, { err }) => ({
    ...state,
    err,
    isLoading: false,
    hasSearched: true,
  })),
  on(testActions.SendCurrentTest, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(testActions.SendCurrentTestSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(testActions.SendCurrentTestFailure, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export const getDelegatedRekeySearchState = createFeatureSelector<DelegatedRekeySearchModel>('delegatedRekeySearch');
