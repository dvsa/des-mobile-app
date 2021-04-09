import { createAction } from '@ngrx/store';
import { Application } from '@dvsa/mes-journal-schema';

export const PopulateApplicationReference = createAction(
  '[JournalEffects] Populate Application Reference',
  (application: Application) => ({ application }),
);
