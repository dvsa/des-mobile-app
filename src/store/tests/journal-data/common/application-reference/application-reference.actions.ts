import { Application } from '@dvsa/mes-journal-schema';
import { createAction } from '@ngrx/store';

export const PopulateApplicationReference = createAction(
  '[JournalEffects] Populate Application Reference',
  (application: Application) => ({ application })
);
