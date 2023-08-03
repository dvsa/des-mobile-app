import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

import { selectCurrentTest } from '@store/tests/tests.selector';
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
