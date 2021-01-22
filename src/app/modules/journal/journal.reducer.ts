import { createFeatureSelector } from '@ngrx/store';

import { get } from 'lodash';
import * as journalActions from './journal.actions';
import { JournalModel } from './journal.model';
import { ConnectionStatus } from '../../providers/network-state/network-state';

export const initialState: JournalModel = {
  isLoading: false,
  lastRefreshed: null,
  slots: {},
  selectedDate: '',
  examiner: null,
  completedTests: [],
};

/* eslint-disable */

export function journalReducer(state = initialState, action: journalActions.JournalActionTypes): JournalModel {
  switch (action.type) {
    case journalActions.LOAD_JOURNAL:
      return {
        ...state,
        isLoading: true,
        error: { message: '', status: 0, statusText: '' },
      };
    case journalActions.CANDIDATE_DETAILS_SEEN:
      return {
        ...state,
        slots: {
          ...state.slots,
          [state.selectedDate]: state.slots[state.selectedDate].map((slot) => {
            if (get(slot, 'slotData.slotDetail.slotId') === action.slotId) {
              return {
                ...slot,
                hasSeenCandidateDetails: true,
              };
            }
            return slot;
          }),
        },
      };
    case journalActions.LOAD_JOURNAL_SUCCESS:
      return {
        ...state,

        // TODO: The reducer has to get the lastRefreshed date from the action
        // And should not do any logic
        lastRefreshed: (action.onlineOffline
          === ConnectionStatus.ONLINE && !action.unAuthenticatedMode) ? new Date() : action.lastRefreshed,
        isLoading: false,
        slots: action.payload.slotItemsByDate,
        examiner: action.payload.examiner,
      };
    case journalActions.LOAD_JOURNAL_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case journalActions.UNLOAD_JOURNAL:
      return initialState;
    case journalActions.UNSET_ERROR:
      const { error, ...stateWithoutError } = state;
      return {
        ...stateWithoutError,
      };
    case journalActions.CLEAR_CHANGED_SLOT:

      // TODO: This should be moved out to an effect
      const slots = state.slots[state.selectedDate].map((slot) => {
        if (get(slot, 'slotData.slotDetail.slotId') === action.slotId) {
          return {
            ...slot,
            hasSlotChanged: false,
          };
        }
        return slot;
      });

      return {
        ...state,
        slots: {
          ...state.slots,
          [state.selectedDate]: slots,
        },
      };
    case journalActions.SET_SELECTED_DAY:
      return {
        ...state,
        selectedDate: action.payload,
      };
    case journalActions.LOAD_COMPLETED_TESTS_SUCCESS:
      return {
        ...state,
        completedTests: action.payload,
      };
    default:
      return state;
  }
}

export const getJournalState = createFeatureSelector<JournalModel>('journal');

/* eslint-enable */
