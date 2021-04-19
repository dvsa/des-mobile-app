import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS as numberOfShowMeQuestions,
}
  from '@shared/constants/show-me-questions/show-me-questions.cat-be.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as numberOfTellMeQuestions,
}
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-be.constants';
import { createReducer, on } from '@ngrx/store';
import * as vehicleChecksCatBeActionTypes from './vehicle-checks.cat-be.actions';

export const initialState: CatBEUniqueTypes.VehicleChecks = {
  tellMeQuestions: Array(numberOfTellMeQuestions).fill({}),
  showMeQuestions: Array(numberOfShowMeQuestions).fill({}),
  vehicleChecksCompleted: null,
};

export const vehicleChecksCatBEReducer = createReducer(
  initialState,
  on(vehicleChecksCatBeActionTypes.ShowMeQuestionSelected, (state, {
    showMeQuestion,
    index,
  }): CatBEUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map((item, localIndex) => localIndex === index ? showMeQuestion : item),
  })),
  on(vehicleChecksCatBeActionTypes.ShowMeQuestionOutcomeChanged, (state, {
    showMeQuestionOutcome,
    index,
  }): CatBEUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map((item, localIndex) =>
      localIndex === index ? { ...item, outcome: showMeQuestionOutcome } : item),
  })),
  on(vehicleChecksCatBeActionTypes.TellMeQuestionSelected, (state, {
    index,
    tellMeQuestion,
  }): CatBEUniqueTypes.VehicleChecks => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map(
      (item, localIndex) => localIndex === index ? tellMeQuestion : item,
    ),
  })),
  on(vehicleChecksCatBeActionTypes.TellMeQuestionOutcomeChanged, (state, {
    index,
    tellMeQuestionOutcome,
  }): CatBEUniqueTypes.VehicleChecks => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map((item, localIndex) =>
      localIndex === index ? { ...item, outcome: tellMeQuestionOutcome } : item),
  })),
  on(vehicleChecksCatBeActionTypes.AddShowMeTellMeComment, (state, {
    comment,
  }): CatBEUniqueTypes.VehicleChecks => ({
    ...state,
    showMeTellMeComments: comment,
  })),
  on(vehicleChecksCatBeActionTypes.VehicleChecksCompletedToggled, (state, {
    toggled,
  }): CatBEUniqueTypes.VehicleChecks => ({
    ...state,
    vehicleChecksCompleted: toggled,
  })),
  on(vehicleChecksCatBeActionTypes.VehicleChecksDrivingFaultsNumberChanged, (state, {
    payload,
  }): CatBEUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: [...payload],
  })),
);
