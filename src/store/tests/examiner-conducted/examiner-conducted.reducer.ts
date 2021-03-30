import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import  * as examinerConductedActions from './examiner-conducted.actions';

export const initialState: number | string = null;

export const examinerConductedReducer = createReducer(
  initialState,
  on(examinerConductedActions.SetExaminerConducted, (state, { payload }) => payload),
);

export const getExaminerConducted = createFeatureSelector<number>('examinerConducted');
