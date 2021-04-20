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
  on(singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome, (state, {
    competencyName,
  }): SingleFaultCompetencies => (
    {
      const: { [competencyName]: removedCompetencyOutcome, ...updatedCompetencyOutcome } = initialState,
      ...updatedCompetencyOutcome,

    })),
  on(singleFaultCompetencyActions.AddSingleFaultCompetencyComment, (state, {
    competencyName,
    comment,
  }): SingleFaultCompentencies => ({
    ...state,
    [`${competencyName}Comments`]: comment,
  })),
);
