import { SingleFaultCompetencies } from '@dvsa/mes-test-schema/categories/AM1';
import { createReducer, on } from '@ngrx/store';

import { omit } from 'lodash';
import * as singleFaultCompetencyActions from './single-fault-competencies.actions';

export const initialState: SingleFaultCompetencies = {};

export const singleFaultCompetenciesReducer = createReducer(
  initialState,
  on(singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome, (state, {
    competencyName,
    outcome,
  }): SingleFaultCompetencies => ({
    ...state,
    [competencyName]: outcome,
  })),
  on(
    singleFaultCompetencyActions.RemoveSingleDangerousFaultCompetencyOutcome,
    singleFaultCompetencyActions.RemoveSingleSeriousFaultCompetencyOutcome,
    singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome, (state, {
      competencyName,
    }): SingleFaultCompetencies => ({
      ...omit(state, competencyName),
    }),
  ),
  on(singleFaultCompetencyActions.AddSingleFaultCompetencyComment, (state, {
    competencyName,
    comment,
  }): SingleFaultCompetencies => ({
    ...state,
    [`${competencyName}Comments`]: comment,
  })),
);
