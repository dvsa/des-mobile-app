import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';

export const PopulateTestCategory = createAction(
  '[Journal Effects] populating test category',
  (categoryCode: CategoryCode) => ({ categoryCode })
);
