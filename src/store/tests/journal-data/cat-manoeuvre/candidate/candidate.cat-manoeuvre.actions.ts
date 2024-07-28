import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { createAction } from '@ngrx/store';

export const PopulateCandidateDetailsCatManoeuvre = createAction(
	'[JournalEffects] [CatManoeuvre] Populate Candidate Details',
	(candidate: CatCMUniqueTypes.Candidate) => ({ candidate })
);
