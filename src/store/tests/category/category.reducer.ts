import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StartE2EPracticeTest } from '@pages/fake-journal/fake-journal.actions';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { ActivateTest, StartTest, StartTestReportPracticeTest } from '@store/tests/tests.actions';
import { selectCurrentTest } from '@store/tests/tests.selector';
import * as categoryActions from './category.actions';

export const initialState: CategoryCode = null;

export const categoryReducer = createReducer(
  initialState,
  on(categoryActions.PopulateTestCategory, (_, { categoryCode }) => categoryCode),
  // set the category as soon as the test is created so testsReducer can derive it from state
  // for the follow-up actions, rather than falling through to the default (Cat B) reducer
  on(StartTest, StartTestReportPracticeTest, StartE2EPracticeTest, (_, { category }) => category),
  // an existing test keeps its stored category
  on(ActivateTest, (state, { category }) => state ?? category)
);

export const getTestCategory = createFeatureSelector<CategoryCode>('category');

export const selectTestCategory = createSelector(selectCurrentTest, (test) => test.category as CategoryCode);

// @TODO: Create common file with similar type of logic based around category.
export const selectIsStandardsCheck = createSelector(selectTestCategory, (category) =>
  isAnyOf(category, [TestCategory.SC])
);
