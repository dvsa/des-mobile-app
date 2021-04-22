import { createAction } from '@ngrx/store';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';

export const PopulateCandidateDetailsCatHome = createAction(
  '[JournalEffects] [CatHome] Populate Candidate Details',
  (candidate: CatFUniqueTypes.Candidate) => ({ candidate }),
);
