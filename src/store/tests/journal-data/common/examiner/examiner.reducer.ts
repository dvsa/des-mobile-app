import { Examiner } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as examinerActions from './examiner.actions';

export const initialState: Examiner = {
  staffNumber: null,
};

export const examinerReducer = createReducer(
  initialState,
  on(examinerActions.PopulateExaminer, (_, { payload }): Examiner => payload),
);

export const getExaminer = createFeatureSelector<Examiner>('examiner');
