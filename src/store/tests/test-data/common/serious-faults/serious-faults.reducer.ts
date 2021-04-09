import { SeriousFaults } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import { omit } from 'lodash';
import * as seriousFaultsActions from './serious-faults.actions';

export const initialState: SeriousFaults = {};

export const seriousFaultsReducer = createReducer(
  initialState,
  on(seriousFaultsActions.AddSeriousFault, (state, { competency }) => ({
    ...state,
    [competency]: true,
  })),
  on(seriousFaultsActions.RemoveSeriousFault, (state, { competency }) => ({
    // not same as original implementation due to TS error
    ...omit(state, competency),
  })),
  on(seriousFaultsActions.AddSeriousFaultComment, (state, {
    competencyName,
    comment,
  }) => ({
    ...state,
    [`${competencyName}Comments`]: comment,
  })),
);
