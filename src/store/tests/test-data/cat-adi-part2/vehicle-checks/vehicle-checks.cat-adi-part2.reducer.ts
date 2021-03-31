import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { createReducer, on } from '@ngrx/store';
import * as vehicleChecksCatADI2ActionTypes from './vehicle-checks.cat-adi-part2.action';
import { CompetencyOutcome } from '../../../../../app/shared/models/competency-outcome';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as numberOfTellMeQuestions
} from 'src/app/shared/constants/tell-me-questions/tell-me-questions.cat-adi-part2.constants';

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

export const vehicleChecksCatADI2Reducer = createReducer(
  initialState,
  on(vehicleChecksCatADI2ActionTypes.ShowMeQuestionSelected, (state, {
    showMeQuestion,
    index
  }): CatADI2UniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map((item, i) => i === index ? {
        ...item,
        code: showMeQuestion.code,
        description: showMeQuestion.description,
        outcome: showMeQuestion.outcome,
      } : item,
    ),
  })),
  on(vehicleChecksCatADI2ActionTypes.TellMeQuestionSelected, (state, {
    tellMeQuestion,
    index
  }): CatADI2UniqueTypes.VehicleChecks => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map((item, i) => i === index ? tellMeQuestion : item),
  })),
  on(vehicleChecksCatADI2ActionTypes.TellMeQuestionOutcomeChanged, (state, {
    tellMeQuestionOutcome,
    index
  }): CatADI2UniqueTypes.VehicleChecks => ({
    ...state,
    tellMeQuestions: state.tellMeQuestions.map((item, i) => i === index ? {
      ...item,
      outcome: tellMeQuestionOutcome,
    } : item),
  })),
  on(vehicleChecksCatADI2ActionTypes.AddShowMeTellMeComment, (state, { payload }): CatADI2UniqueTypes.VehicleChecks => ({
    ...state,
    showMeTellMeComments: payload,
  })),
  on(vehicleChecksCatADI2ActionTypes.ShowMeQuestionRemoveDrivingFault, (state, { payload }): CatADI2UniqueTypes.VehicleChecks => ({
    ...state,
    showMeQuestions: state.showMeQuestions.map((item, i) => i === payload ? {
      ...item,
      outcome: CompetencyOutcome.P,
    } : item),
  })),
  on(vehicleChecksCatADI2ActionTypes.VehicleChecksAddSeriousFault, (state): CatADI2UniqueTypes.VehicleChecks => ({
    ...state,
    seriousFault: true,
  })),
  on(vehicleChecksCatADI2ActionTypes.VehicleChecksAddDangerousFault, (state): CatADI2UniqueTypes.VehicleChecks => ({
    ...state,
    dangerousFault: true,
  })),
  on(vehicleChecksCatADI2ActionTypes.VehicleChecksRemoveSeriousFault, (state): CatADI2UniqueTypes.VehicleChecks => ({
    ...state,
    seriousFault: false,
  })),
  on(vehicleChecksCatADI2ActionTypes.VehicleChecksRemoveDangerousFault, (state): CatADI2UniqueTypes.VehicleChecks => ({
    ...state,
    dangerousFault: false,
  })),
  on(vehicleChecksCatADI2ActionTypes.VehicleChecksCompletedToggle, (state): CatADI2UniqueTypes.VehicleChecks => ({
    ...state,
    vehicleChecksCompleted: !state.vehicleChecksCompleted,
  })),
);
