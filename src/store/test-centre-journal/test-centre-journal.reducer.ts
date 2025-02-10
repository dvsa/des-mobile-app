import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
  ResetTestCentreJournal,
  SetLastRefreshed,
  TestCentreJournalEnteredFromDashboard,
  TestCentreJournalEnteredFromTest,
} from './test-centre-journal.actions';
import { TestCentreJournalModel } from './test-centre-journal.model';

export const testCentreJournalFeatureKey = 'testCentreJournal';

export const initialState: TestCentreJournalModel = {
  lastRefreshed: null,
  enteredDuringTest: false,
};

export const testCentreJournalReducer = createReducer(
  initialState,
  on(SetLastRefreshed, (state: TestCentreJournalModel, { lastRefreshed }) => ({
    ...state,
    lastRefreshed,
  })),
  on(TestCentreJournalEnteredFromDashboard, (state: TestCentreJournalModel) => ({
    ...state,
    enteredDuringTest: false,
  })),
  on(TestCentreJournalEnteredFromTest, (state: TestCentreJournalModel) => ({
    ...state,
    enteredDuringTest: true,
  })),
  on(ResetTestCentreJournal, () => initialState)
);

export const getTestCentreJournalState = createFeatureSelector<TestCentreJournalModel>('testCentreJournal');
