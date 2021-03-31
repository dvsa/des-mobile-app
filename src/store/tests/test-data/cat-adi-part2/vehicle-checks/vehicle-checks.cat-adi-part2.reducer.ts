import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import * as vehicleChecksCatADI2ActionTypes from './vehicle-checks.cat-adi-part2.action';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as numberOfTellMeQuestions,
}
  from '../../../../../shared/constants/tell-me-questions/tell-me-questions.cat-adi-part2.constants';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';

export const initialState: CatADI2UniqueTypes.VehicleChecks = {
  tellMeQuestions: Array(numberOfTellMeQuestions).fill({}),
  showMeQuestions: [
    {
      code: '',
      description: '',
      outcome: CompetencyOutcome.P,
    },
    {
      code: '',
      description: '',
      outcome: CompetencyOutcome.P,
    },
  ],
  seriousFault: false,
  dangerousFault: false,
  vehicleChecksCompleted: false,
};

export function vehicleChecksCatADI2Reducer(
  state: CatADI2UniqueTypes.VehicleChecks = initialState,
  action: vehicleChecksCatADI2ActionTypes.Types,
): CatADI2UniqueTypes.VehicleChecks {

  switch (action.type) {
    case vehicleChecksCatADI2ActionTypes.SHOW_ME_QUESTION_SELECTED:
      return {
        ...state,
        showMeQuestions: state.showMeQuestions.map(
          (item, index) => index === action.index ? {
            ...item,
            code: action.showMeQuestion.code,
            description: action.showMeQuestion.description,
            outcome: action.showMeQuestion.outcome,
          } : item,
        ),
      };
    case vehicleChecksCatADI2ActionTypes.TELL_ME_QUESTION_SELECTED:
      return {
        ...state,
        tellMeQuestions: state.tellMeQuestions.map(
          (item, index) => index === action.index ? action.tellMeQuestion : item,
        ),
      };
    case vehicleChecksCatADI2ActionTypes.TELL_ME_QUESTION_OUTCOME_CHANGED:
      return {
        ...state,
        tellMeQuestions: state.tellMeQuestions.map((item, index) => index === action.index ? {
          ...item,
          outcome: action.tellMeQuestionOutcome,
        } : item),
      };
    case vehicleChecksCatADI2ActionTypes.ADD_SHOW_ME_TELL_ME_COMMENT:
      return {
        ...state,
        showMeTellMeComments: action.comment,
      };
    case vehicleChecksCatADI2ActionTypes.SHOW_ME_QUESTION_ADD_DRIVING_FAULT:
      return {
        ...state,
        showMeQuestions: state.showMeQuestions.map(
          (item, index) =>  index === action.index ? {
            ...item,
            outcome: CompetencyOutcome.DF,
          } : item),
      };
    case vehicleChecksCatADI2ActionTypes.SHOW_ME_QUESTION_REMOVE_DRIVING_FAULT:
      return {
        ...state,
        showMeQuestions: state.showMeQuestions.map(
          (item, index) =>  index === action.index ? {
            ...item,
            outcome: CompetencyOutcome.P,
          } : item),
      };

    case vehicleChecksCatADI2ActionTypes.VEHICLE_CHECKS_ADD_SERIOUS_FAULT:
      return {
        ...state,
        seriousFault: true,
      };
    case vehicleChecksCatADI2ActionTypes.VEHICLE_CHECKS_ADD_DANGEROUS_FAULT:
      return {
        ...state,
        dangerousFault: true,
      };
    case vehicleChecksCatADI2ActionTypes.VEHICLE_CHECKS_REMOVE_SERIOUS_FAULT:
      return {
        ...state,
        seriousFault: false,
      };
    case vehicleChecksCatADI2ActionTypes.VEHICLE_CHECKS_REMOVE_DANGEROUS_FAULT:
      return {
        ...state,
        dangerousFault: false,
      };
    case vehicleChecksCatADI2ActionTypes.VEHICLE_CHECKS_TOGGLE:
      return {
        ...state,
        vehicleChecksCompleted: !state.vehicleChecksCompleted,
      };
    default:
      return state;
  }
}
