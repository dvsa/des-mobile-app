import * as singleFaultCompetencyActions from './single-fault-competencies.actions';
import { SingleFaultCompetencies } from '@dvsa/mes-test-schema/categories/AM1';
import { createReducer, on } from '@ngrx/store';

export const initialState: SingleFaultCompetencies = {};

export const singleFaultCompetenciesReducer = createReducer(
  initialState,
  on(singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome, (state, {
      SingleFaultCompetencyNames,
      SingleFaultCompetencyOutcome,
    }): SingleFaultCompetencies => ({
      ...state,
      [SingleFaultCompetencyNames]: SingleFaultCompetencyOutcome,
    }),
  ),
  on(singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome, (state, {
      competencyName,
    }): SingleFaultCompetencies => (
      {
        const: { [competencyName]: removedCompetencyOutcome, ...updatedCompetencyOutcome } = initialState,
      ...updatedCompetencyOutcome,

    }),
  ),
  on(singleFaultCompetencyActions.AddSingleFaultCompetencyComment, (state, {
      competencyName,
      comment,
    }): SingleFaultCompentencies => ({
      ...state,
      [`${competencyName}Comments`]: comment,
    }),
  ),
)
