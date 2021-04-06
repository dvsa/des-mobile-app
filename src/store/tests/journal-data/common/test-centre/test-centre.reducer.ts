import { TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testCentreActions from './test-centre.actions';

export const initialState: TestCentre = {
  centreId: null,
  costCode: null,
};

export const testCentreReducer = createReducer(
  initialState,
  on(testCentreActions.PopulateTestCentre, (_, { testCentre }): TestCentre => testCentre),
);

export const getTestCentre = createFeatureSelector<TestCentre>('testCentre');
