import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { createAction } from '@ngrx/store';

export const PopulateCandidateDetailsCatHome = createAction(
	'[JournalEffects] [CatHome] Populate Candidate Details',
	(candidate: CatFUniqueTypes.Candidate) => ({ candidate })
);
