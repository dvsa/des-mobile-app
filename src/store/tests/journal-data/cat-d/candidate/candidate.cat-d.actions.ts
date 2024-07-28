import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { createAction } from '@ngrx/store';

export const PopulateCandidateDetailsCatD = createAction(
	'[JournalEffects] [CatD] Populate Candidate Details',
	(candidate: CatDUniqueTypes.Candidate) => ({ candidate })
);
