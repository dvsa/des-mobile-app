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
    competencyName
  }): SingleFaultCompetencies => ({
    const { [competencyName]: removedCompetencyOutcome, ...updatedCompetencyOutcome } = initialState;
  ...state,

}))
)

// export function singleFaultCompetenciesReducer(
//   state: SingleFaultCompetencies = initialState,
//   action: singleFaultCompetencyActions.Types,
// ): SingleFaultCompetencies {
//   switch (action.type) {
//     case singleFaultCompetencyActions.REMOVE_SINGLE_FAULT_COMPETENCY_OUTCOME:
//     case singleFaultCompetencyActions.REMOVE_SINGLE_DANGEROUS_FAULT_COMPETENCY_OUTCOME:
//     case singleFaultCompetencyActions.REMOVE_SINGLE_SERIOUS_FAULT_COMPETENCY_OUTCOME:
//       const { [action.competencyName]: removedCompetencyOutcome, ...updatedCompetencyOutcome } = state;
//       return {
//         ...updatedCompetencyOutcome,
//       };
//     case singleFaultCompetencyActions.ADD_SINGLE_FAULT_COMPETENCY_COMMENT:
//       return {
//         ...state,
//         [`${action.competencyName}Comments`]: action.comment,
//       };
//     default:
//       return state;
//   }
//
// }
