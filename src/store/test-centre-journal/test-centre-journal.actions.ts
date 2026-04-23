import { createAction, props } from '@ngrx/store';
import { DateTime } from '@shared/helpers/date-time';

export const SetLastRefreshed = createAction(
  '[TestCentreJournalEffects] Set test centre journal last refreshed',
  props<{ lastRefreshed: DateTime }>()
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
