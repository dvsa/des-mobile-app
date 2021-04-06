import { TestSlot } from '@dvsa/mes-journal-schema';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import * as rekeySearchActions from './rekey-search.actions';
import { RekeySearchError, RekeySearchErrorMessages } from './rekey-search-error-model';

export type RekeySearchModel = {
  isLoading: boolean,
  hasSearched: boolean,
  staffNumber: string,
  bookedTestSlot: TestSlot,
  err: RekeySearchError | HttpErrorResponse,
};

export const initialState: RekeySearchModel = {
  isLoading: false,
  hasSearched: false,
  staffNumber: '',
  bookedTestSlot: {},
  err: {
    message: '' as RekeySearchErrorMessages,
  },
};

export const rekeySearchReducer = createReducer(
  initialState,
  on(rekeySearchActions.RekeySearchClearState, () => ({
    ...initialState,
  })),
  on(rekeySearchActions.SearchBookedTest, (state) => ({
    ...state,
    bookedTestSlot: {},
    isLoading: true,
    hasSearched: false,
  })),
  on(rekeySearchActions.SearchBookedTestSuccess, (state, { testSlot, staffNumber }) => ({
    ...state,
    bookedTestSlot: testSlot,
    isLoading: false,
    hasSearched: true,
    staffNumber,
  })),
  on(rekeySearchActions.SearchBookedTestFailure, (state, { err }) => ({
    ...state,
    err,
    isLoading: false,
    hasSearched: true,
  })),
);

export const getRekeySearchState = createFeatureSelector<RekeySearchModel>('rekeySearch');
