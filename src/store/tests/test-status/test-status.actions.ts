import { createAction, props } from '@ngrx/store';

export const SetTestStatusBooked = createAction(
  '[JournalEffects] Set Test Status to Booked',
  props<{ payload: string }>(),
);

export const SetTestStatusStarted = createAction(
  '[JournalEffects] Set Test Status to Started',
  props<{ payload: string }>(),
);

export const SetTestStatusDecided = createAction(
  '[JournalEffects] Set Test Status to Decided',
  props<{ payload: string }>(),
);

export const SetTestStatusWriteUp = createAction(
  '[JournalEffects] Set Test Status to WriteUp',
  props<{ payload: string }>(),
);

export const SetTestStatusAutosaved = createAction(
  '[JournalEffects] Set Test Status to Autosaved',
  props<{ payload: string }>(),
);

export const SetTestStatusCompleted = createAction(
  '[JournalEffects] Set Test Status to Completed',
  props<{ payload: string }>(),
);

export const SetTestStatusSubmitted = createAction(
  '[JournalEffects] Set Test Status to Submitted',
  props<{ payload: string }>(),
);
