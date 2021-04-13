import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as rekeyActions from './rekey.actions';

export const initialState: boolean = false;

export const rekeyReducer = createReducer(
  initialState,
  on(rekeyActions.MarkAsRekey, () => true),
  on(rekeyActions.MarkAsNonRekey, () => false),
);

export const getRekeyIndicator = createFeatureSelector<boolean>('rekey');
