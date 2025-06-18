import { createAction } from '@ngrx/store';

export const EndTimeChanged = createAction('[FinalisationPage] End time changed', (time: string) => ({ time }));

export const StartTimeChanged = createAction('[FinalisationPage] Start time changed', (time: string) => ({ time }));

export const StandardsChecksTestIsTooShortReasonChanged = createAction(
  '[FinalisationPage] Standards Checks Test is too short reason changed',
  (reason: string) => ({ reason })
);

export const StandardsChecksTestIsTooShortChanged = createAction(
  '[FinalisationPage] Standards Checks Test is too short changed',
  (isTooShort: boolean) => ({ isTooShort })
);

export const ConfirmStartEndTimeChanged = createAction(
  '[FinalisationPage] Start and End time confirmed',
  (selected: boolean) => ({ selected })
);

export const SetReasonForShortTest = createAction(
  '[UserExitedAppEffects] Set reason for the test having a time on road that is too short',
  (reason: string) => ({ reason })
);
