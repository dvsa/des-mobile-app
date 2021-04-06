import { createAction, props } from '@ngrx/store';

export const IpadIssueSelected = createAction(
  '[RekeyReasonPage] Rekey Reason Ipad Issue Selected',
  props<{ payload: boolean }>(),
);

export const IpadIssueTechFaultSelected = createAction(
  '[RekeyReasonPage] Rekey Reason Ipad Issue Tech Fault Selected'
);

export const IpadIssueLostSelected = createAction(
  '[RekeyReasonPage] Rekey Reason Ipad Issue Lost Selected'
);

export const IpadIssueStolenSelected = createAction(
  '[RekeyReasonPage] Rekey Reason Ipad Issue Stolen Selected'
);

export const IpadIssueBrokenSelected = createAction(
  '[RekeyReasonPage] Rekey Reason Ipad Issue Broken Selected'
);

export const TransferSelected = createAction(
  '[RekeyReasonPage] Rekey Reason Transfer Selected',
  (transferSelected: boolean) => ({ transferSelected }),
);

export const OtherSelected = createAction(
  '[RekeyReasonPage] Rekey Reason Other Selected',
  (otherSelected: boolean) => ({ otherSelected }),
);

export const OtherReasonUpdated = createAction(
  '[RekeyReasonPage] Rekey Reason Other Reason Updated',
  (reason: string) => ({ reason }),
);
