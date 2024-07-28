import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';

export const NonPassFinalisationViewDidEnter = createAction(
	'[NonPassFinalisationPage] NonPassFinalisation view did enter'
);

export const NonPassFinalisationReportActivityCode = createAction(
	'[NonPassFinalisationPage] NonPass Finalisation report activity code',
	(activityCode: ActivityCode) => ({ activityCode })
);

export const NonPassFinalisationValidationError = createAction(
	'[NonPassFinalisationPage] Validation Error',
	(errorMessage: string) => ({ errorMessage })
);
