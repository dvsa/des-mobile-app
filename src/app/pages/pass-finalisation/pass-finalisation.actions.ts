import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';

export const PassFinalisationViewDidEnter = createAction('[PassFinalisationPage] Pass Finalisation view did enter');

export const PassFinalisationReportActivityCode = createAction(
	'[PassFinalisationPage] Pass Finalisation report activity code',
	(activityCode: ActivityCode) => ({ activityCode })
);

export const PassFinalisationValidationError = createAction(
	'[PassFinalisationPage] Validation error',
	(errorMessage: string) => ({ errorMessage })
);
