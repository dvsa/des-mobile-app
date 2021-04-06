import { DelegatedRekeySearchModel, initialState } from '../delegated-rekey-search.reducer';
import { getIsLoading, getHasSearched, getBookedTestSlot  } from '../delegated-rekey-search.selector';

describe('Delegated Rekey Search Selector', () => {
  describe('getIsLoading', () => {
    it('should return the correct isLoading value', () => {
      const state: DelegatedRekeySearchModel = {
        ...initialState,
        isLoading: true,
      };
      const isLoading = getIsLoading(state);
      expect(isLoading).toBe(state.isLoading);
    });
  });

  describe('getHasSearched', () => {
    it('should return the correct hasSearched value', () => {
      const state: DelegatedRekeySearchModel = {
        ...initialState,
        hasSearched: true,
      };
      const hasSearched = getHasSearched(state);
      expect(hasSearched).toBe(state.hasSearched);
    });
  });

  describe('getBookedTestSlot', () => {
    it('should return the correct bookedTestSlot value', () => {
      const state: DelegatedRekeySearchModel = {
        ...initialState,
        bookedTestSlot: {
          booking: {
            application: {
              applicationId: 22123411,
              bookingSequence: 3,
              checkDigit: 1,
              testCategory: 'H',
            },
            candidate: {
              candidateName: {
                firstName: 'A Delegated',
                lastName: 'Candidate',
              },
              driverNumber: 'DAVID015220A99HC',
              dateOfBirth: '1980-01-01',
            },
          },
          slotDetail: {
            slotId: 1234567,
            start: '2020-07-15T08:10:00',
          },
          vehicleTypeCode: 'C',
        },
      };
      const bookedTestSlot = getBookedTestSlot(state);
      expect(bookedTestSlot).toEqual(state.bookedTestSlot);
    });
  });

});
