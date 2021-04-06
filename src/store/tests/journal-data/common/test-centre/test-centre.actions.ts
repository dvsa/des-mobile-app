import { createAction } from '@ngrx/store';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';

export const PopulateTestCentre = createAction(
  '[TestCentreEffects] Populate test centre',
  (testCentre: TestCentre) => ({ testCentre }),
);
