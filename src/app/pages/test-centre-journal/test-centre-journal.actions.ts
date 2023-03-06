import { createAction } from '@ngrx/store';

export const TestCentreJournalViewDidEnter = createAction(
  '[TestCentreJournal] Test Centre Journal Did Enter',
);

export const TestCentreJournalGetData = createAction(
  '[TestCentreJournal] Test Centre Journal Get Data',
  (manualRefresh: boolean) => ({ manualRefresh }),
);

export const TestCentreJournalSelectTestCentre = createAction(
  '[TestCentreJournal] Test Centre Journal select test centre',
);

export const TestCentreJournalTabChanged = createAction(
  '[TestCentreJournal] Test Centre Journal tab changed',
  (tab: string) => ({ tab }),
);

export const TestCentreJournalDateNavigation = createAction(
  '[TestCentreJournal] Test Centre Journal changed date view',
  (day: string) => ({ day }),
);

// Candidate Search actions
export const TestCentreJournalSelectCandidate = createAction(
  '[TestCentreJournal] Test Centre Journal select candidate',
);

export const TestCentreJournalShowBookings = createAction(
  '[TestCentreJournal] Test Centre Journal show bookings clicked',
);

// View Journals actions
export const TestCentreJournalSelectExaminer = createAction(
  '[TestCentreJournal] Test Centre Journal select examiner',
);

export const TestCentreJournalShowJournals = createAction(
  '[TestCentreJournal] Test Centre Journal show journals clicked',
);
