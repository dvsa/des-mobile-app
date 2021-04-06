import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

import * as categoryActions from './category.actions';

export const initialState: CategoryCode = null;

export const categoryReducer = createReducer(
  initialState,
  on(categoryActions.PopulateTestCategory, (_, { categoryCode }) => categoryCode),
);

export const getTestCategory = createFeatureSelector<CategoryCode>('category');
