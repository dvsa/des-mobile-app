import { createSelector } from '@ngrx/store';
import { getFormattedApplicationReference } from '@shared/helpers/formatters';
import { getApplicationNumber } from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { selectCurrentTest } from '@store/tests/tests.selector';
import { isEmpty } from 'lodash-es';
import { RekeySearchModel, getRekeySearchState } from './rekey-search.reducer';

export const getIsLoading = (rekeySearch: RekeySearchModel) => rekeySearch.isLoading;

export const getHasSearched = (rekeySearch: RekeySearchModel) => rekeySearch.hasSearched;

export const getStaffNumber = (rekeySearch: RekeySearchModel) => rekeySearch.staffNumber;

export const getIsHalfAnHourLate = (rekeySearch: RekeySearchModel) => rekeySearch.isBookedLessThanHalfAnHourLate;

export const getRekeySearchError = (rekeySearch: RekeySearchModel) => rekeySearch.err;

export const getBookedTestSlot = (rekeySearch: RekeySearchModel) => {
  // The reason why we are null checking in a selector is that
  // the rekey-search module might not yet been imported
  // so the rekey-search reducer is not yet registered
  // therefore no initial sate for this slice of the store
  if (isEmpty(rekeySearch)) {
    return null;
  }

  return rekeySearch.bookedTestSlot;
};

export const selectIsCurrentTestFromRekeySearch = createSelector(
  getRekeySearchState,
  selectCurrentTest,
  (searchState, currentTest) => {
    const slot = getBookedTestSlot(searchState);
    return (
      !isEmpty(slot) &&
      !!currentTest &&
      getFormattedApplicationReference(slot.booking?.application) ===
        getApplicationNumber(currentTest.journalData.applicationReference)
    );
  }
);
