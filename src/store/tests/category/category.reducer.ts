import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

import { selectCurrentTest } from '@store/tests/tests.selector';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import * as categoryActions from './category.actions';

export const initialState: CategoryCode = null;

export const categoryReducer = createReducer(
  initialState,
  on(categoryActions.PopulateTestCategory, (_, { categoryCode }) => categoryCode),
);

export const getTestCategory = createFeatureSelector<CategoryCode>('category');

export const selectTestCategory = createSelector(
  selectCurrentTest,
  (test) => test.category as CategoryCode,
);

// @TODO: Create common file with similar type of logic based around category.
export const selectIsStandardsCheck = createSelector(
  selectTestCategory,
  (category) => isAnyOf(category, [TestCategory.SC]),
);
