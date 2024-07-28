import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';

export const SetActivityCode = createAction('[Tests] Set activity code', (activityCode: ActivityCode) => ({
	activityCode,
}));
