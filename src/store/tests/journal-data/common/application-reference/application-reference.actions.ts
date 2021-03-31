import { createAction, props } from '@ngrx/store';
import { Application } from '@dvsa/mes-journal-schema';

export const PopulateApplicationReference = createAction(
  '[JournalEffects] Populate Application Reference',
  props<{ payload: Application }>()
);
