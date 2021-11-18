import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { createReducer, on } from '@ngrx/store';
import { dropRight } from 'lodash';
import * as vehicleChecksCatCActionTypes from './vehicle-checks.cat-c.action';

const initialState: CatCUniqueTypes.VehicleChecks = {
  tellMeQuestions: Array(1).fill({}),
  showMeQuestions: Array(1).fill({}),
  vehicleChecksCompleted: null,
  fullLicenceHeld: null,
};

export const generateInitialState = (): CatCUniqueTypes.VehicleChecks => ({
  tellMeQuestions: Array(2).fill({}),
  showMeQuestions: Array(3).fill({}),
  vehicleChecksCompleted: null,
  fullLicenceHeld: null,
});

export const vehicleChecksCatCReducer = createReducer(
  initialState,
  on(vehicleChecksCatCActionTypes.InitialiseVehicleChecks, (): CatCUniqueTypes.VehicleChecks => ({
    ...generateInitialState(),
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
  on(vehicleChecksCatCActionTypes.DropExtraVehicleChecks, (state): CatCUniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: dropRight(state.showMeQuestions, state.showMeQuestions.length - 1),
    tellMeQuestions: dropRight(state.tellMeQuestions, state.tellMeQuestions.length - 1),
  })),
  on(vehicleChecksCatCActionTypes.SetFullLicenceHeld, (state, { fullLicenceHeld }): CatCUniqueTypes.VehicleChecks => ({
    ...state,
    fullLicenceHeld,
  })),
);
