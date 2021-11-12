import { createAction } from '@ngrx/store';

export const IpadIssueSelected = createAction(
  '[FakeJournalPage] Rekey Reason Ipad Issue Selected',
  (payload: boolean) => ({ payload }),
);

export const IpadIssueTechFaultSelected = createAction(
  '[FakeJournalPage] Rekey Reason Ipad Issue Tech Fault Selected',
);

export const IpadIssueLostSelected = createAction(
  '[FakeJournalPage] Rekey Reason Ipad Issue Lost Selected',
);

export const IpadIssueStolenSelected = createAction(
  '[FakeJournalPage] Rekey Reason Ipad Issue Stolen Selected',
);

export const IpadIssueBrokenSelected = createAction(
  '[FakeJournalPage] Rekey Reason Ipad Issue Broken Selected',
);

export const TransferSelected = createAction(
  '[FakeJournalPage] Rekey Reason Transfer Selected',
  (transferSelected: boolean) => ({ transferSelected }),
);

export const OtherSelected = createAction(
  '[FakeJournalPage] Rekey Reason Other Selected',
  (otherSelected: boolean) => ({ otherSelected }),
);

export const OtherReasonUpdated = createAction(
  '[FakeJournalPage] Rekey Reason Other Reason Updated',
  (reason: string) => ({ reason }),
);
