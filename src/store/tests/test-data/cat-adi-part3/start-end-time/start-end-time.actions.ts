import { StandardsChecksTestLength } from '@dvsa/mes-test-schema/categories/ADI3';
import { createAction } from '@ngrx/store';

export const EndTimeChanged = createAction('[FinalisationPage] End time changed', (time: string) => ({ time }));

export const StartTimeChanged = createAction('[FinalisationPage] Start time changed', (time: string) => ({ time }));

export const StandardsChecksDurationDataChanged = createAction(
  '[FinalisationPage] Standards Checks Duration Data changed',
  (standardChecksDuration: StandardsChecksTestLength) => ({ standardChecksDuration })
);

export const ConfirmStartEndTimeChanged = createAction(
  '[FinalisationPage] Start and End time confirmed',
  (selected: boolean) => ({ selected })
);
