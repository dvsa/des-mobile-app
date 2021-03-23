import { createReducer, createFeatureSelector, on } from '@ngrx/store';
import {
  SetLastRefreshed,
} from './test-centre-journal.actions';
import { TestCentreJournalModel } from './test-centre-journal.model';

export const testCentreJournalFeatureKey = 'testCentreJournal';

export const initialState: TestCentreJournalModel = {
  lastRefreshed: null,
};

export const testCentreJournalReducer = createReducer(
  initialState,
  on(SetLastRefreshed, (state: TestCentreJournalModel, { lastRefreshed }) => ({
    ...state,
    lastRefreshed,
  })),
);

export const getTestCentreJournalState = createFeatureSelector<TestCentreJournalModel>('testCentreJournal');
