import { Candidate } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';

export const PopulateCandidateDetails = createAction(
	'[JournalEffects] Populate Candidate Details',
	(candidate: Candidate) => ({ candidate })
);
