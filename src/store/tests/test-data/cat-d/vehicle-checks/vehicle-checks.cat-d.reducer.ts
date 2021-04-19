import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { createReducer, on } from '@ngrx/store';
import * as vehicleChecksCatDActionTypes from './vehicle-checks.cat-d.action';

export const generateInitialState = (category: TestCategory): CatDUniqueTypes.VehicleChecks => {
  // eslint-disable-next-line default-case
  switch (category) {
    case TestCategory.D:
    case TestCategory.D1:
      return {
        tellMeQuestions: Array(2).fill({}),
        showMeQuestions: Array(3).fill({}),
        vehicleChecksCompleted: null,
      };
    case TestCategory.DE:
    case TestCategory.D1E:
      return {
        tellMeQuestions: Array(1).fill({}),
        showMeQuestions: Array(1).fill({}),
        vehicleChecksCompleted: null,
      };
  }
};

export const vehicleChecksCatDReducer = createReducer(
  generateInitialState(TestCategory.D),

  on(vehicleChecksCatDActionTypes.InitializeVehicleChecks, (state, { category }) => (
    generateInitialState(category)
  )),

  on(vehicleChecksCatDActionTypes.ShowMeQuestionOutcomeChanged, (state, { showMeQuestionOutcome, index }) => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map((item, itemIndex) => (index === itemIndex ? {
      ...item,
      outcome: showMeQuestionOutcome,
    } : item)),
  })),

  on(vehicleChecksCatDActionTypes.ShowMeQuestionSelected, (state, { showMeQuestion, index }) => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map(
      (item, itemIndex) => (index === itemIndex ? showMeQuestion : item),
    ),
  })),

  on(vehicleChecksCatDActionTypes.TellMeQuestionSelected, (state, { tellMeQuestion, index }) => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map(
      (item, itemIndex) => (index === itemIndex ? tellMeQuestion : item),
    ),
  })),

  on(vehicleChecksCatDActionTypes.TellMeQuestionOutcomeChanged, (state, { tellMeQuestionOutcome, index }) => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map((item, itemIndex) => (index === itemIndex ? {
      ...item,
      outcome: tellMeQuestionOutcome,
    } : item)),
  })),

  on(vehicleChecksCatDActionTypes.AddShowMeTellMeComment, (state, { comment }) => ({
    ...state,
    showMeTellMeComments: comment,
  })),

  on(vehicleChecksCatDActionTypes.VehicleChecksCompletedToggled, (state, { toggled }) => ({
    ...state,
    vehicleChecksCompleted: toggled,
  })),

  on(vehicleChecksCatDActionTypes.VehicleChecksDrivingFaultsNumberChanged, (state, { payload }) => ({
    ...state,
    showMeQuestions: [...payload],
  })),

);
