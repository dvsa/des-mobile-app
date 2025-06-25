import { createAction, union } from '@ngrx/store';

export const RecallModalClosed = createAction('[SafetyRecallEffects] User closed the safety recall modal');
export const RecallLinkSelected = createAction('[SafetyRecallEffects] User selected the safety recall link');

const actions = union({
  RecallModalClosed,
  RecallLinkSelected,
});

export type SafetyRecallLearnMoreModalActions = typeof actions;
