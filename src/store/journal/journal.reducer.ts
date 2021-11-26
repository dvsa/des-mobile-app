import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { get } from 'lodash';

import { ConnectionStatus } from '@providers/network-state/network-state';
import * as journalActions from './journal.actions';
import { JournalModel } from './journal.model';

export const initialState: JournalModel = {
  isLoading: false,
  lastRefreshed: null,
  slots: {},
  selectedDate: '',
  examiner: null,
  completedTests: [],
};

export const journalFeatureKey = 'journal';

export const journalReducer = createReducer(
  initialState,
  on(journalActions.LoadJournal, (state: JournalModel): JournalModel => ({
    ...state,
    isLoading: true,
    error: { message: '', status: 0, statusText: '' },
  })),
  on(journalActions.CandidateDetailsSeen, (state: JournalModel, { slotId }): JournalModel => {
    if (!state.slots[state.selectedDate]) {
      return { ...state };
    }
    return {
      ...state,
      slots: {
        ...state.slots,
        [state.selectedDate]: state.slots[state.selectedDate].map((slot) => {
          if (get(slot, 'slotData.slotDetail.slotId') === slotId) {
            return {
              ...slot,
              hasSeenCandidateDetails: true,
            };
          }
          return slot;
        }),
      },
    };
  }),
  on(journalActions.LoadJournalSuccess, (state: JournalModel, {
    onlineOffline,
    lastRefreshed,
    unAuthenticatedMode,
    payload,
  }): JournalModel => ({
    ...state,
    lastRefreshed: (onlineOffline
      === ConnectionStatus.ONLINE && !unAuthenticatedMode) ? new Date() : lastRefreshed,
    isLoading: false,
    slots: payload.slotItemsByDate,
    examiner: payload.examiner,
  })),
  on(journalActions.LoadJournalFailure, (state: JournalModel, { error }): JournalModel => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(journalActions.UnloadJournal, (): JournalModel => initialState),
  on(journalActions.UnsetError, (state: JournalModel): JournalModel => {
    const { error, ...stateWithoutError } = state;
    return {
      ...stateWithoutError,
    };
  }),
  on(journalActions.ClearChangedSlot, (state: JournalModel, { slotId }): JournalModel => {
    if (!state.slots[state.selectedDate]) {
      return { ...state };
    }
    const slots = state.slots[state.selectedDate].map((slot) => {
      if (get(slot, 'slotData.slotDetail.slotId') === slotId) {
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
  }),
  on(journalActions.SetSelectedDate, (state: JournalModel, { selectedDate }): JournalModel => ({
    ...state,
    selectedDate,
  })),
  on(journalActions.LoadCompletedTestsSuccess, (state: JournalModel, {
    completedTests,
  }): JournalModel => ({
    ...state,
    isLoading: false,
    completedTests,
  })),
  on(journalActions.LoadJournalsNoConnection, (state: JournalModel): JournalModel => ({
    ...state,
    isLoading: false,
  })),
);

export const getJournalState = createFeatureSelector<JournalModel>('journal');
