import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { createReducer, on } from '@ngrx/store';
import * as vehicleChecksCatCActionTypes from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import { dropRight } from 'lodash';
import * as vehicleChecksCatDActionTypes from './vehicle-checks.cat-d.action';

const initialState: CatDUniqueTypes.VehicleChecks = {
  tellMeQuestions: Array(1).fill({}),
  showMeQuestions: Array(1).fill({}),
  vehicleChecksCompleted: null,
  fullLicenceHeld: null,
};

export const generateInitialState = (): CatDUniqueTypes.VehicleChecks => ({
  tellMeQuestions: Array(2).fill({}),
  showMeQuestions: Array(3).fill({}),
  vehicleChecksCompleted: null,
  fullLicenceHeld: null,
});

export const vehicleChecksCatDReducer = createReducer(
  initialState,
  on(vehicleChecksCatDActionTypes.InitializeVehicleChecks, (): CatDUniqueTypes.VehicleChecks => ({
    ...generateInitialState(),
  })),
  on(vehicleChecksCatDActionTypes.ShowMeQuestionOutcomeChanged, (state, {
    showMeQuestionOutcome,
    index,
  }): CatDUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map((item, itemIndex) => (index === itemIndex ? {
      ...item,
      outcome: showMeQuestionOutcome,
    } : item)),
  })),
  on(vehicleChecksCatDActionTypes.ShowMeQuestionSelected, (state, {
    showMeQuestion,
    index,
  }): CatDUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map(
      (item, itemIndex) => (index === itemIndex ? showMeQuestion : item),
    ),
  })),
  on(vehicleChecksCatDActionTypes.TellMeQuestionSelected, (state, {
    tellMeQuestion,
    index,
  }): CatDUniqueTypes.VehicleChecks => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map(
      (item, itemIndex) => (index === itemIndex ? tellMeQuestion : item),
    ),
  })),
  on(vehicleChecksCatDActionTypes.TellMeQuestionOutcomeChanged, (state, {
    tellMeQuestionOutcome,
    index,
  }): CatDUniqueTypes.VehicleChecks => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map((item, itemIndex) => (index === itemIndex ? {
      ...item,
      outcome: tellMeQuestionOutcome,
    } : item)),
  })),
  on(vehicleChecksCatDActionTypes.AddShowMeTellMeComment, (state, {
    comment,
  }): CatDUniqueTypes.VehicleChecks => ({
    ...state,
    showMeTellMeComments: comment,
  })),
  on(vehicleChecksCatDActionTypes.VehicleChecksCompletedToggled, (state, {
    toggled,
  }): CatDUniqueTypes.VehicleChecks => ({
    ...state,
    vehicleChecksCompleted: toggled,
  })),
  on(vehicleChecksCatDActionTypes.VehicleChecksDrivingFaultsNumberChanged, (state, {
    payload,
  }): CatDUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: [...payload],
  })),
  on(vehicleChecksCatCActionTypes.DropExtraVehicleChecks, (state): CatDUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: dropRight(state.showMeQuestions, state.showMeQuestions.length - 1),
    tellMeQuestions: dropRight(state.tellMeQuestions, state.tellMeQuestions.length - 1),
  })),
  on(vehicleChecksCatCActionTypes.DropExtraVehicleChecksDelegated, (state): CatDUniqueTypes.VehicleChecks => {
    const showMeQuestion1 = state.showMeQuestions.shift();
    return {
      ...state,
      tellMeQuestions: showMeQuestion1 ? [showMeQuestion1] : [],
      showMeQuestions: state.showMeQuestions || [],
    };
  }),
  on(vehicleChecksCatCActionTypes.SetFullLicenceHeld, (state, { fullLicenceHeld }): CatDUniqueTypes.VehicleChecks => ({
    ...state,
    fullLicenceHeld,
  })),
);
