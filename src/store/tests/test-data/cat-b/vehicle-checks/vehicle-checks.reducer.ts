import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { createReducer, on } from '@ngrx/store';
import * as vehicleChecksActions from './vehicle-checks.actions';

export const initialState: CatBUniqueTypes.VehicleChecks = {
  tellMeQuestion: {},
  showMeQuestion: {},
};

export const vehicleChecksReducer = createReducer(
  initialState,
  on(vehicleChecksActions.TellMeQuestionSelected, (state, { tellMeQuestion }) => (
    {
      ...state,
      tellMeQuestion: {
        code: tellMeQuestion.code,
        description: tellMeQuestion.shortName,
      },
    }
  )),
  on(vehicleChecksActions.TellMeQuestionCorrect, (state) => ({
    ...state,
    tellMeQuestion: {
      ...state.tellMeQuestion,
      outcome: CompetencyOutcome.P,
    },
  })),
  on(vehicleChecksActions.TellMeQuestionDrivingFault, (state) => ({
    ...state,
    tellMeQuestion: {
      ...state.tellMeQuestion,
      outcome: CompetencyOutcome.DF,
    },
  })),
  on(vehicleChecksActions.ShowMeQuestionSelected, (state, payload) => ({
    ...state,
    showMeQuestion: {
      ...state.showMeQuestion,
      code: payload.showMeQuestion.code,
      description: payload.showMeQuestion.shortName,
    },
  })),
  on(vehicleChecksActions.ShowMeQuestionPassed, (state) => ({
    ...state,
    showMeQuestion: {
      ...state.showMeQuestion,
      outcome: CompetencyOutcome.P,
    },
  })),
  on(vehicleChecksActions.ShowMeQuestionSeriousFault, (state) => ({
    ...state,
    showMeQuestion: {
      ...state.showMeQuestion,
      outcome: CompetencyOutcome.S,
    },
  })),
  on(vehicleChecksActions.ShowMeQuestionDangerousFault, (state) => ({
    ...state,
    showMeQuestion: {
      ...state.showMeQuestion,
      outcome: CompetencyOutcome.D,
    },
  })),
  on(vehicleChecksActions.ShowMeQuestionDrivingFault, (state) => ({
    ...state,
    showMeQuestion: {
      ...state.showMeQuestion,
      outcome: CompetencyOutcome.DF,
    },
  })),
  on(vehicleChecksActions.ShowMeQuestionRemoveFault, (state) => {
    const { outcome, ...notOutcome } = state.showMeQuestion;

    return {
      ...state,
      showMeQuestion: {
        ...notOutcome,
      },
    };
  }),
  on(vehicleChecksActions.AddShowMeTellMeComment, (state, payload) => ({
    ...state,
    showMeTellMeComments: payload.comment,
  })),
);
