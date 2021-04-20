import { SingleFaultCompetencies } from '@dvsa/mes-test-schema/categories/AM1';
import { createReducer, on } from '@ngrx/store';
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
  on(singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome,
    singleFaultCompetencyActions.RemoveSingleSeriousFaultCompetencyOutcome,
    singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome, (state, {
      competencyName,
    }): SingleFaultCompetencies => {
      delete state[competencyName];
      return { ...state };
    }),
  on(singleFaultCompetencyActions.AddSingleFaultCompetencyComment, (state, {
    competencyName,
    comment,
  }): SingleFaultCompetencies => ({
    ...state,
    [`${competencyName}Comments`]: comment,
  })),
);
