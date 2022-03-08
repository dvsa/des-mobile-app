import { createAction } from '@ngrx/store';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';

export const PopulateCandidateDetailsCatManoeuvre = createAction(
  '[JournalEffects] [CatManoeuvre] Populate Candidate Details',
  (candidate: CatCMUniqueTypes.Candidate) => ({ candidate }),
);
