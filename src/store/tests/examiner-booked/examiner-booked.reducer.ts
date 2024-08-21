import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as examinerBookedActions from './examiner-booked.actions';

export const initialState: number | string = null;

export const examinerBookedReducer = createReducer(
  initialState,
  on(examinerBookedActions.SetExaminerBooked, (_, { examinerBooked }) => examinerBooked)
);

export const getExaminerBooked = createFeatureSelector<number>('examinerBooked');
