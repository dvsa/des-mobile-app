import { createAction, union } from '@ngrx/store';

export const SetTestStatusBooked = createAction(
  '[JournalEffects] Set Test Status to Booked',
  (slotId: string) => ({ slotId }),
);

export const SetTestStatusStarted = createAction(
  '[JournalEffects] Set Test Status to Started',
  (slotId: string) => ({ slotId }),
);

export const SetTestStatusDecided = createAction(
  '[JournalEffects] Set Test Status to Decided',
  (slotId: string) => ({ slotId }),
);

export const SetTestStatusWriteUp = createAction(
  '[JournalEffects] Set Test Status to WriteUp',
  (slotId: string) => ({ slotId }),
);

export const SetTestStatusAutosaved = createAction(
  '[JournalEffects] Set Test Status to Autosaved',
  (slotId: string) => ({ slotId }),
);

export const SetTestStatusCompleted = createAction(
  '[JournalEffects] Set Test Status to Completed',
  (slotId: string) => ({ slotId }),
);

export const SetTestStatusSubmitted = createAction(
  '[JournalEffects] Set Test Status to Submitted',
  (slotId: string) => ({ slotId }),
);

const actions = union({
  SetTestStatusBooked,
  SetTestStatusStarted,
  SetTestStatusDecided,
  SetTestStatusWriteUp,
  SetTestStatusAutosaved,
  SetTestStatusCompleted,
  SetTestStatusSubmitted,
});

export type TestStatusActions = typeof actions;
