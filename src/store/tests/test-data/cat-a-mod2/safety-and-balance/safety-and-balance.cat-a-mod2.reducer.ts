import { createReducer, on } from '@ngrx/store';
import { SafetyAndBalanceQuestions } from '@dvsa/mes-test-schema/categories/AM2';
import {
  NUMBER_OF_SAFETY_QUESTIONS as numberOfSafetyQuestions,
} from '@shared/constants/safety-questions.cat-a-mod2.constants';
import {
  NUMBER_OF_BALANCE_QUESTIONS as numberOfBalanceQuestions,
} from '@shared/constants/balance-questions.cat-a-mod2.constants';
import * as vehicleChecksCatAMod2ActionTypes from './safety-and-balance.cat-a-mod2.actions';

export const initialState: SafetyAndBalanceQuestions = {
  safetyQuestions: Array(numberOfSafetyQuestions).fill({}),
  balanceQuestions: Array(numberOfBalanceQuestions).fill({}),
};

export const safetyAndBalanceCatAMod2Reducer = createReducer(
  initialState,
  on(vehicleChecksCatAMod2ActionTypes.SafetyQuestionSelected, (state, {
    safetyQuestion,
    index,
  }): SafetyAndBalanceQuestions => ({
    ...state,
    safetyQuestions: state.safetyQuestions.map((item, i) => (i === index ? safetyQuestion : item)),
  })),
  on(vehicleChecksCatAMod2ActionTypes.SafetyQuestionOutcomeChanged, (state, {
    safetyQuestionOutcome,
    index,
  }): SafetyAndBalanceQuestions => ({
    ...state,
    safetyQuestions: (
      state.safetyQuestions.map((item, i) => (i === index ? {
        ...item,
        outcome: safetyQuestionOutcome,
      } : item))
    ),
  })),
  on(vehicleChecksCatAMod2ActionTypes.BalanceQuestionSelected, (state, {
    balanceQuestion,
    index,
  }): SafetyAndBalanceQuestions => ({
    ...state,
    balanceQuestions: state.balanceQuestions.map((item, i) => (i === index ? balanceQuestion : item)),
  })),
  on(vehicleChecksCatAMod2ActionTypes.BalanceQuestionOutcomeChanged, (state, {
    balanceQuestionOutcome,
    index,
  }): SafetyAndBalanceQuestions => ({
    ...state,
    balanceQuestions: (
      state.balanceQuestions.map((item, i) => (i === index ? {
        ...item,
        outcome: balanceQuestionOutcome,
      } : item))
    ),
  })),
  on(vehicleChecksCatAMod2ActionTypes.AddSafetyAndBalanceComment, (state, {
    comment,
  }): SafetyAndBalanceQuestions => ({
    ...state,
    safetyAndBalanceComments: comment,
  })),
);
