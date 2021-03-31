import { SeriousFaults } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import { omit } from 'lodash';
import * as seriousFaultsActions from './serious-faults.actions';

export const initialState: SeriousFaults = {};

export const seriousFaultsReducer = createReducer(
  initialState,
  on(seriousFaultsActions.AddSeriousFault, (state, { payload }) => ({
    ...state,
    [payload]: true,
  })),
  on(seriousFaultsActions.RemoveSeriousFault, (state, { payload }) => ({
    // not same as original implementation due to TS error
    ...omit(state, payload),
  })),
  on(seriousFaultsActions.AddSeriousFaultComment, (state, {
    competencyName,
    comment
  }) => ({
    ...state,
    [`${competencyName}Comments`]: comment,
  })),
);
