import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as appVersionActions from './app-version.actions';

export const initialState: string = '';

export const appVersionReducer = createReducer(
  initialState,
  on(appVersionActions.PopulateAppVersion, (_, { appVersion }) => appVersion),
);

export const getAppVersion = createFeatureSelector<string>('appVersion');
