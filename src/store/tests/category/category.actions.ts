import { createAction } from '@ngrx/store';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

export const PopulateTestCategory = createAction(
  '[Journal Effects] populating test category',
  (categoryCode: CategoryCode) => ({ categoryCode }),
);
