import { createAction, union } from '@ngrx/store';

export const RecallModalClosed = createAction('[SafetyRecallEffects] User closed the safety recall modal');
export const RecallLinkSelected = createAction('[SafetyRecallEffects] User selected the safety recall link');
export const RecallLearnMoreModalOpened = createAction(
  '[SafetyRecallEffects] User opened the safety recall learn more modal'
);
export const CheckVINPressed = createAction('[SafetyRecallEffects] User pressed the check VIN button');

const actions = union({
  RecallModalClosed,
  RecallLinkSelected,
  RecallLearnMoreModalOpened,
  CheckVINPressed,
});

export type SafetyRecallActions = typeof actions;
