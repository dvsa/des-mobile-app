import { TestSlot } from '@dvsa/mes-journal-schema';
import { HttpErrorResponse } from '@angular/common/http';

import { initialState, delegatedSearchReducer } from '../delegated-rekey-search.reducer';
import * as delegatedRekeySearchActions from '../delegated-rekey-search.actions';

describe('Rekey Search Reducer', () => {
  it('should turn on loading state when searching for tests', () => {
    const state = {
      ...initialState,
    };
    const appRef = '123456';
    const action = delegatedRekeySearchActions.SearchBookedDelegatedTest(appRef);
    const result = delegatedSearchReducer(state, action);
    expect(result).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should store payload, turn loading state off and searched state on when search is successful', () => {
    const state = {
      ...initialState,
      isLoading: true,
    };
    const testSlot: TestSlot = {
      slotDetail: {
        slotId: 4363463,
      },
      booking: {
        application: {
          applicationId: 12345,
          bookingSequence: 11,
          checkDigit: 1,
        },
      },
    };
    const action = delegatedRekeySearchActions.SearchBookedDelegatedTestSuccess(testSlot);
    const result = delegatedSearchReducer(state, action);
    expect(result).toEqual({
      ...initialState,
      isLoading: false,
      hasSearched: true,
      bookedTestSlot: {
        ...testSlot,
      },
    });
  });

  it('should store error, turn off loading state and searched state on when search was unsuccessful', () => {
    const state = {
      ...initialState,
      isLoading: true,
    };
    const err = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      url: 'http://localhost:8100/dummy/search/booking/url?appRef=5235',
      error: 'html error',
    });
    const action = delegatedRekeySearchActions.SearchBookedDelegatedTestFailure(err);
    const result = delegatedSearchReducer(state, action);
    expect(result).toEqual({
      ...initialState,
      err,
      isLoading: false,
      hasSearched: true,
    });
  });
});
