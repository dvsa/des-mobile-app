import { TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testCentreActions from './test-centre.actions';

export const initialState: TestCentre = {
  centreId: null,
  costCode: null,
};

export const testCentreReducer = createReducer(
  initialState,
  on(testCentreActions.PopulateTestCentre, (_, { payload }): TestCentre => payload),
);

export const getTestCentre = createFeatureSelector<TestCentre>('testCentre');
