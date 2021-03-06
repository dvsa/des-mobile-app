import { createAction } from '@ngrx/store';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';

export const SetActivityCode = createAction(
  '[Tests] Set activity code',
  (activityCode: ActivityCode) => ({ activityCode }),
);
