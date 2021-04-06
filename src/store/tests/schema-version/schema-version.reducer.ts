import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as schemaVersionActions from './schema-version.actions';

export const initialState: string = '';

export const schemaVersionReducer = createReducer(
  initialState,
  on(schemaVersionActions.PopulateTestSchemaVersion, (_, { version }) => version),
);

export const getTestSchemaVersion = createFeatureSelector<string>('schemaVersion');
