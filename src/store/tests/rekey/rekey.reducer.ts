import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { selectCurrentTest } from '@store/tests/tests.selector';
import { get } from 'lodash-es';
import * as rekeyActions from './rekey.actions';

export const initialState: boolean = false;

export const rekeyReducer = createReducer(
  initialState,
  on(rekeyActions.MarkAsRekey, () => true),
  on(rekeyActions.MarkAsNonRekey, () => false)
);

export const getRekeyIndicator = createFeatureSelector<boolean>('rekey');

export const selectRekey = createSelector(selectCurrentTest, (test) => get(test, 'rekey'));
