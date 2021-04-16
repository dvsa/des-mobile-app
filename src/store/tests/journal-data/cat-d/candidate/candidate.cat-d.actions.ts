import { createAction } from '@ngrx/store';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';

export const PopulateCandidateDetailsCatD = createAction(
  '[JournalEffects] [CatD] Populate Candidate Details',
  (candidate: CatDUniqueTypes.Candidate) => ({ candidate }),
);
