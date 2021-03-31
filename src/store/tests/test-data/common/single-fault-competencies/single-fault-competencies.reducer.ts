import * as singleFaultCompetencyActions from './single-fault-competencies.actions';
import { SingleFaultCompetencies } from '@dvsa/mes-test-schema/categories/AM1';

export const initialState: SingleFaultCompetencies = {};

export function singleFaultCompetenciesReducer(
  state: SingleFaultCompetencies = initialState,
  action: singleFaultCompetencyActions.Types,
): SingleFaultCompetencies {
  switch (action.type) {
    case singleFaultCompetencyActions.SET_SINGLE_FAULT_COMPETENCY_OUTCOME:
      return {
        ...state,
        [action.competencyName]: action.outcome,
      };
    case singleFaultCompetencyActions.REMOVE_SINGLE_FAULT_COMPETENCY_OUTCOME:
    case singleFaultCompetencyActions.REMOVE_SINGLE_DANGEROUS_FAULT_COMPETENCY_OUTCOME:
    case singleFaultCompetencyActions.REMOVE_SINGLE_SERIOUS_FAULT_COMPETENCY_OUTCOME:
      const { [action.competencyName]: removedCompetencyOutcome, ...updatedCompetencyOutcome } = state;
      return {
        ...updatedCompetencyOutcome,
      };
    case singleFaultCompetencyActions.ADD_SINGLE_FAULT_COMPETENCY_COMMENT:
      return {
        ...state,
        [`${action.competencyName}Comments`]: action.comment,
      };
    default:
      return state;
  }

}
