import { createAction, props } from '@ngrx/store';
import { Candidate } from '@dvsa/mes-test-schema/categories/common';

export const PopulateCandidateDetails = createAction(
  '[JournalEffects] Populate Candidate Details',
  props<{ payload: Candidate }>()
);
