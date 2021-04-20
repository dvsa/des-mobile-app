import { createAction } from '@ngrx/store';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';

export const PopulateCandidateDetailsCatBE = createAction(
  '[JournalEffects] [CatBE] Populate Candidate Details',
  (candidate: CatBEUniqueTypes.Candidate) => ({ candidate }),
);
