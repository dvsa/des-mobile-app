import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as delegatedTestActions from './delegated-test.actions';

export const initialState: boolean = false;

export const delegatedTestReducer = createReducer(
  initialState,
  on(delegatedTestActions.StartDelegatedTest, () => true),
);

export const getDelegatedTestIndicator = createFeatureSelector<boolean>('delegatedTest');
