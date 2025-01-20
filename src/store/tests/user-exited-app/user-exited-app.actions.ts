import { createAction, union } from '@ngrx/store';

export const SetHasExitedApp = createAction('[UserExitedAppEffects] User has left the app during a test');

export const SetHasNotExitedApp = createAction('[UserExitedAppEffects] User has not left the app during a test');

export const SetReasonForExitingApp = createAction(
  '[UserExitedAppEffects] Set reason for user leaving app during a test',
  (reason: string) => ({ reason })
);

const actions = union({
  SetReasonForExitingApp,
  SetHasExitedApp,
  SetHasNotExitedApp,
});

export type UserExitedAppActions = typeof actions;
