import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { ResetTestCentreJournal, SetLastRefreshed } from './test-centre-journal.actions';
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
  on(ResetTestCentreJournal, () => initialState)
);

export const getTestCentreJournalState = createFeatureSelector<TestCentreJournalModel>('testCentreJournal');
