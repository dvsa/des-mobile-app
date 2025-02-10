import { createAction, props } from '@ngrx/store';

export const SetLastRefreshed = createAction(
  '[TestCentreJournalEffects] Set test centre journal last refreshed',
  props<{ lastRefreshed: Date }>()
);
export const ResetTestCentreJournal = createAction(
  '[TestCentreJournalEffects] Reset test centre journal last refreshed'
);

export const TestCentreJournalEnteredFromTest = createAction(
  '[TestCentreJournalEffects] Test centre journal entered from waiting room to car'
);

export const TestCentreJournalEnteredFromDashboard = createAction(
  '[TestCentreJournalEffects] Test centre journal entered from dashboard'
);
