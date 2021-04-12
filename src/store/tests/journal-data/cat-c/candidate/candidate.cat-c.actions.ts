import { createAction } from '@ngrx/store';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';

export const PopulateCandidateDetailsCatC = createAction(
  '[JournalEffects] [CatC] Populate Candidate Details',
  (candidate: CatCUniqueTypes.Candidate) => ({ candidate }),
);
