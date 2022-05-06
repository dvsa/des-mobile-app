import { createAction, props } from '@ngrx/store';
import { TestSlot } from '@dvsa/mes-journal-schema';

export const CandidateDetailsViewDidEnter = createAction(
  '[CandidateDetailsPage] Candidate details view did enter',
  props<{ slot: TestSlot }>(),
);

export const CandidateDetailsModalDismiss = createAction(
  '[CandidateDetailsPage] Candidate details modal dismiss',
  props<{ sourcePage: string }>(),
);

export const CandidateDetailsSlotChangeViewed = createAction(
  '[CandidateDetailsPage] Candidate details slot change viewed',
  props<{ slotId: number }>(),
);
