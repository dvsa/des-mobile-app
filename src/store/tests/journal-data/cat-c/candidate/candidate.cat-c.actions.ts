import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { createAction } from '@ngrx/store';

export const PopulateCandidateDetailsCatC = createAction(
  '[JournalEffects] [CatC] Populate Candidate Details',
  (candidate: CatCUniqueTypes.Candidate) => ({ candidate })
);
