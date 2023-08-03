import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as rekeyActions from './rekey.actions';
import { selectCurrentTest } from '@store/tests/tests.selector';

export const initialState: boolean = false;

export const rekeyReducer = createReducer(
  initialState,
  on(rekeyActions.MarkAsRekey, () => true),
  on(rekeyActions.MarkAsNonRekey, () => false),
);

export const getRekeyIndicator = createFeatureSelector<boolean>('rekey');

export const selectRekey = createSelector(
  selectCurrentTest,
  (test) => test.rekey,
);
