import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { createReducer, on } from '@ngrx/store';
import * as vehicleChecksCatCActionTypes from './vehicle-checks.cat-c.action';

const initialState: CatCUniqueTypes.VehicleChecks = {
  tellMeQuestions: Array(1).fill({}),
  showMeQuestions: Array(1).fill({}),
  vehicleChecksCompleted: null,
};

export const generateInitialState = (category: TestCategory): CatCUniqueTypes.VehicleChecks => {
  // eslint-disable-next-line default-case
  switch (category) {
    case TestCategory.C:
    case TestCategory.C1:
      return {
        tellMeQuestions: Array(2).fill({}),
        showMeQuestions: Array(3).fill({}),
        vehicleChecksCompleted: null,
      };
    case TestCategory.CE:
    case TestCategory.C1E:
      return {
        tellMeQuestions: Array(1).fill({}),
        showMeQuestions: Array(1).fill({}),
        vehicleChecksCompleted: null,
      };
  }
};

export const vehicleChecksCatCReducer = createReducer(
  initialState,
  on(vehicleChecksCatCActionTypes.InitialiseVehicleChecks, (_, {
    category,
  }): CatCUniqueTypes.VehicleChecks => ({
    ...generateInitialState(category),
  })),
  on(vehicleChecksCatCActionTypes.ShowMeQuestionSelected, (state, {
    showMeQuestion,
    index,
  }): CatCUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map((item, i) => (i === index ? showMeQuestion : item)),
  })),
  on(vehicleChecksCatCActionTypes.ShowMeQuestionOutcomeChanged, (state, {
    showMeQuestionOutcome,
    index,
  }): CatCUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map((item, i) => (i === index ? {
      ...item,
      outcome: showMeQuestionOutcome,
    } : item)),
  })),
  on(vehicleChecksCatCActionTypes.TellMeQuestionSelected, (state, {
    tellMeQuestion,
    index,
  }): CatCUniqueTypes.VehicleChecks => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map((item, i) => (i === index ? tellMeQuestion : item)),
  })),
  on(vehicleChecksCatCActionTypes.TellMeQuestionOutcomeChanged, (state, {
    tellMeQuestionOutcome,
    index,
  }): CatCUniqueTypes.VehicleChecks => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map((item, i) => (i === index ? {
      ...item,
      outcome: tellMeQuestionOutcome,
    } : item)),
  })),
  on(vehicleChecksCatCActionTypes.AddShowMeTellMeComment, (state, {
    comment,
  }): CatCUniqueTypes.VehicleChecks => ({
    ...state,
    showMeTellMeComments: comment,
  })),
  on(vehicleChecksCatCActionTypes.VehicleChecksCompletedToggled, (state, {
    toggled,
  }): CatCUniqueTypes.VehicleChecks => ({
    ...state,
    vehicleChecksCompleted: toggled,
  })),
  on(vehicleChecksCatCActionTypes.VehicleChecksDrivingFaultsNumberChanged, (state, {
    payload,
  }): CatCUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: [...payload],
  })),
);
