import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as examinerKeyedActions from './examiner-keyed.actions';

export const initialState: number = null;

export const examinerKeyedReducer = createReducer(
  initialState,
  on(examinerKeyedActions.SetExaminerKeyed, (state, { examinerKeyed }) => examinerKeyed),
);

export const getExaminerKeyed = createFeatureSelector<number>('examinerKeyed');
