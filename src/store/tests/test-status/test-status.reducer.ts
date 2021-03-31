import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { TestStatus } from './test-status.model';
import * as testStatusActions from './test-status.actions';

export const initialState = {};

export const testStatusReducer = createReducer(
  initialState,
  on(testStatusActions.SetTestStatusBooked, (state, { payload }) => ({
    ...state,
    [payload]: TestStatus.Booked,
  })),
  on(testStatusActions.SetTestStatusStarted, (state, { payload }) => ({
    ...state,
    [payload]: TestStatus.Started,
  })),
  on(testStatusActions.SetTestStatusDecided, (state, { payload }) => ({
    ...state,
    [payload]: TestStatus.Decided,
  })),
  on(testStatusActions.SetTestStatusWriteUp, (state, { payload }) => ({
    ...state,
    [payload]: TestStatus.WriteUp,
  })),
  on(testStatusActions.SetTestStatusAutosaved, (state, { payload }) => ({
    ...state,
    [payload]: TestStatus.Autosaved,
  })),
  on(testStatusActions.SetTestStatusCompleted, (state, { payload }) => ({
    ...state,
    [payload]: TestStatus.Completed,
  })),
  on(testStatusActions.SetTestStatusSubmitted, (state, { payload }) => ({
    ...state,
    [payload]: TestStatus.Submitted,
  })),
);

export const getTestStatus = createFeatureSelector<TestStatus>('testStatus');
