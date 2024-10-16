import { createReducer, on } from '@ngrx/store';
import { NUMBER_OF_SHOW_ME_QUESTIONS } from '@shared/constants/show-me-questions/show-me-questions.cat-home-test.constants';
import { NUMBER_OF_TELL_ME_QUESTIONS } from '@shared/constants/tell-me-questions/tell-me-questions.cat-home-test.constants';
import { VehicleChecksUnion } from '@shared/unions/test-schema-unions';
import * as vehicleChecksCatHomeActionTypes from './vehicle-checks.cat-home.actions';

export const initialState: VehicleChecksUnion = {
  tellMeQuestions: Array(NUMBER_OF_TELL_ME_QUESTIONS).fill({}),
  showMeQuestions: Array(NUMBER_OF_SHOW_ME_QUESTIONS).fill({}),
};

export const vehicleChecksCatHomeReducer = createReducer(
  initialState,
  on(vehicleChecksCatHomeActionTypes.ShowMeQuestionSelected, (state, { showMeQuestion, index }) => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map((item, itemIndex) => (index === itemIndex ? showMeQuestion : item)),
  })),
  on(vehicleChecksCatHomeActionTypes.ShowMeQuestionOutcomeChanged, (state, { showMeQuestionOutcome, index }) => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map((item, itemIndex) =>
      index === itemIndex
        ? {
            ...item,
            outcome: showMeQuestionOutcome,
          }
        : item
    ),
  })),
  on(vehicleChecksCatHomeActionTypes.TellMeQuestionSelected, (state, { tellMeQuestion, index }) => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map((item, i) => (i === index ? tellMeQuestion : item)),
  })),
  on(vehicleChecksCatHomeActionTypes.TellMeQuestionOutcomeChanged, (state, { tellMeQuestionOutcome, index }) => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map((item, itemIndex) =>
      index === itemIndex
        ? {
            ...item,
            outcome: tellMeQuestionOutcome,
          }
        : item
    ),
  })),
  on(vehicleChecksCatHomeActionTypes.AddShowMeTellMeComment, (state, { comment }) => ({
    ...state,
    showMeTellMeComments: comment,
  }))
);
