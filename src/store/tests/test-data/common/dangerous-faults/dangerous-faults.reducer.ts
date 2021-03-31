import { DangerousFaults } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import { omit } from 'lodash';
import * as dangerousFaultsActions from './dangerous-faults.actions';

export const initialState: DangerousFaults = {};

export const dangerousFaultsReducer = createReducer(
  initialState,
  on(dangerousFaultsActions.AddDangerousFault, (state, { payload }) => ({
    ...state,
    [payload]: true,
  })),
  on(dangerousFaultsActions.RemoveDangerousFault, (state, { payload }) => ({
    // not same as original implementation due to TS error
    ...omit(state, payload),
  })),
  on(dangerousFaultsActions.AddDangerousFaultComment, (state, {
    competencyName,
    comment
  }) => ({
    ...state,
    [`${competencyName}Comments`]: comment,
  })),
);
