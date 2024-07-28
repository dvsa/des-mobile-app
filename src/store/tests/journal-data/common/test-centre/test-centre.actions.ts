import { TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';

export const PopulateTestCentre = createAction(
	'[TestCentreEffects] Populate test centre',
	(testCentre: TestCentre) => ({ testCentre })
);
