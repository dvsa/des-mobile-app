import { createSelector } from '@ngrx/store';
import { selectCurrentTest } from '../tests.selector';

export const isRekey = (rekey: boolean | undefined) => rekey ?? false;

export const selectRekey = createSelector(selectCurrentTest, (test) => isRekey(test?.rekey));
