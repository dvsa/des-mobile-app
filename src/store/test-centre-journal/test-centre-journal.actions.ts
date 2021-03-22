import { createAction, props } from '@ngrx/store';

export const SetLastRefreshed = createAction(
  '[TestCentreJournalEffects] Set test centre journal last refreshed',
  props<{ lastRefreshed: Date; }>(),
);
