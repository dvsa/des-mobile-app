import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { TestStatus } from './test-status.model';
import * as testStatusActions from './test-status.actions';

export const initialState = {};

export const testStatusReducer = createReducer(
  initialState,
  on(testStatusActions.SetTestStatusBooked, (state, { slotId }) => ({
    ...state,
    [slotId]: TestStatus.Booked,
  })),
  on(testStatusActions.SetTestStatusStarted, (state, { slotId }) => ({
    ...state,
    [slotId]: TestStatus.Started,
  })),
  on(testStatusActions.SetTestStatusDecided, (state, { slotId }) => ({
    ...state,
    [slotId]: TestStatus.Decided,
  })),
  on(testStatusActions.SetTestStatusWriteUp, (state, { slotId }) => ({
    ...state,
    [slotId]: TestStatus.WriteUp,
  })),
  on(testStatusActions.SetTestStatusAutosaved, (state, { slotId }) => ({
    ...state,
    [slotId]: TestStatus.Autosaved,
  })),
  on(testStatusActions.SetTestStatusCompleted, (state, { slotId }) => ({
    ...state,
    [slotId]: TestStatus.Completed,
  })),
  on(testStatusActions.SetTestStatusSubmitted, (state, { slotId }) => ({
    ...state,
    [slotId]: TestStatus.Submitted,
  })),
);

export const getTestStatus = createFeatureSelector<TestStatus>('testStatus');
