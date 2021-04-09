import { initialState, journalReducer } from '../journal.reducer';
import {
  LoadJournal,
  LoadJournalSuccess,
  UnloadJournal,
  UnsetError,
  ClearChangedSlot,
  CandidateDetailsSeen,
  LoadCompletedTestsSuccess,
} from '../journal.actions';
import { JournalModel } from '../journal.model';
import { ConnectionStatus } from '../../../app/providers/network-state/network-state';
import { SlotItem } from '../../../app/providers/slot-selector/slot-item';
import { searchResultsMock } from '../../../app/providers/search/__mocks__/search-results.mock';

describe('Journal Reducer', () => {

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'NOOP' } as any;
      const result = journalReducer(undefined, action);

      expect(result).toBe(initialState);
    });
  });

  describe('[JournalPage] Load Journal', () => {
    it('should toggle loading state', () => {
      const action = LoadJournal();
      const result = journalReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isLoading: true,
        error: { message: '', status: 0, statusText: '' },
      });
    });
  });

  describe('[JournalPage] Load Journal Success', () => {
    it('should toggle loading state and populate slots + examiner', () => {
      const actionPayload = {
        examiner: { staffNumber: '123', individualId: 456 },
        slotItemsByDate: {
          '2019-01-13': [{
            hasSlotChanged: false,
            hasSeenCandidateDetails: false,
            slotData: {},
          },
          ],
        },
      };

      const action = LoadJournalSuccess(
        actionPayload,
        ConnectionStatus.ONLINE,
        false,
        new Date(),
      );

      const state = {
        ...initialState,
        selectedDate: '2019-01-13',
      };

      const result = journalReducer(state, action);

      expect(result).toEqual({
        ...state,
        isLoading: false,
        lastRefreshed: jasmine.any(Date),
        slots: {
          '2019-01-13': [{
            hasSlotChanged: false,
            hasSeenCandidateDetails: false,
            slotData: {},
          },
          ],
        },
        examiner: { staffNumber: '123', individualId: 456 },
      });
    });
  });

  describe('[JournalPage] Unload Journal', () => {
    it('should clear the journal slots', () => {
      const stateWithJournals = {
        ...initialState,
        slots: {
          '2019-01-13': [new SlotItem({}, false, false)],
        },
      };
      const action = UnloadJournal();
      const result = journalReducer(stateWithJournals, action);
      expect(result.slots).toEqual({});
    });
    it('should reset the rest of the journal to default state', () => {
      const stateWithJournals = {
        isLoading: true,
        lastRefreshed: new Date(),
        selectedDate: 'dummy',
        slots: { '2019-01-13': [new SlotItem({}, false, false)] },
        examiner: { staffNumber: '123', individualId: 456 },
        checkComplete: [],
        completedTests: [],
      };
      const action = UnloadJournal();
      const result = journalReducer(stateWithJournals, action);
      expect(result.isLoading).toBe(false);
      expect(result.lastRefreshed).toBeNull();
      expect(result.selectedDate).toBe('');
      expect(result.examiner).toBeNull();
    });
  });

  describe('[JournalPage] Unset error', () => {
    it('should remove any journal error in the state', () => {
      const stateWithError = { ...initialState, error: { message: '', status: 0, statusText: '' } };
      const action = UnsetError();
      const result = journalReducer(stateWithError, action);
      expect(result.error).toBeUndefined();
    });
  });

  describe('[JournalPage] Clear Changed Slot', () => {
    it('should clear hasChangedState flag on specified slot', () => {
      const slotDate = '2019-01-13';
      const stateWithChangedSlot = {
        ...initialState,
        selectedDate: slotDate,
        slots: {
          [`${slotDate}`]: [new SlotItem({ slotDetail: { slotId: 1234 } }, true, false)],
        },
      };
      const action = ClearChangedSlot(1234);
      const result = journalReducer(stateWithChangedSlot, action);
      expect(result.slots[slotDate][0].hasSlotChanged).toEqual(false);

    });

    it('should return current state when selectedDate in slots is undefined', () => {
      const state = {
        ...initialState,
        selectedDate: '',
        slots: {},
      } as JournalModel;
      const action = ClearChangedSlot(1234);
      const result = journalReducer(state, action);
      expect(result).toEqual(state);
    });
  });

  describe('[JournalPage] Candidate Details Seen', () => {
    it('should record that has seen candidate details for a specific slot', () => {
      const slotDate = '2019-01-13';
      const stateWithChangedSlot = {
        ...initialState,
        selectedDate: slotDate,
        slots: {
          [`${slotDate}`]: [new SlotItem({ slotDetail: { slotId: 1234 } }, true, false)],
        },
      };
      const action = CandidateDetailsSeen({ slotId: 1234 });
      const result = journalReducer(stateWithChangedSlot, action);

      expect(result.slots[slotDate][0].hasSeenCandidateDetails).toEqual(true);

    });

    it('should return current state when selectedDate in slots is undefined', () => {
      const state = {
        ...initialState,
        selectedDate: '',
        slots: {},
      } as JournalModel;
      const action = CandidateDetailsSeen({ slotId: 1234 });
      const result = journalReducer(state, action);
      expect(result).toEqual(state);
    });
  });

  // @TODO: Enable when action is used
  xdescribe('[JournalEffect] Load Completed Tests Success', () => {
    it('should save competed test details and also set loading state to false', () => {
      const state: JournalModel = {
        ...initialState,
        isLoading: true,
      };

      const action = LoadCompletedTestsSuccess(searchResultsMock);

      const result = journalReducer(state, action);

      expect(result.isLoading).toBe(false);
      expect(result.completedTests).toEqual(searchResultsMock);
    });
  });
});
