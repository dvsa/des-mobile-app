import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { SafetyAndBalanceQuestions } from '@dvsa/mes-test-schema/categories/AM2';
import { cloneDeep } from 'lodash';
import {
  initialState,
  safetyAndBalanceCatAMod2Reducer,
} from '../safety-and-balance.cat-a-mod2.reducer';
import {
  SafetyQuestionSelected,
  SafetyQuestionOutcomeChanged,
  BalanceQuestionSelected,
  BalanceQuestionOutcomeChanged,
  AddSafetyAndBalanceComment,
} from '../safety-and-balance.cat-a-mod2.actions';

describe('Vehicle Checks Cat A Mod2 Reducer', () => {

  describe('SAFETY_QUESTION_SELECTED', () => {
    it('should add the safety question in the payload to the array at the specified index', () => {
      const newQuestionPayload: QuestionResult = {
        code: 'S1',
        description: 'desc',
      };
      const state: SafetyAndBalanceQuestions = cloneDeep(initialState);
      const result = safetyAndBalanceCatAMod2Reducer(state, SafetyQuestionSelected(newQuestionPayload, 1));
      expect(result.safetyQuestions[1].code).toEqual('S1');
      expect(result.safetyQuestions[1].description).toEqual('desc');
    });
  });

  describe('SAFETY_QUESTION_OUTCOME_CHANGED', () => {
    it('should update the outcome property for the object at the specified index', () => {
      const state: SafetyAndBalanceQuestions = cloneDeep(initialState);
      state.safetyQuestions[1] = {
        code: 'S1',
        description: 'desc',
        outcome: 'P',
      };
      const result = safetyAndBalanceCatAMod2Reducer(state, SafetyQuestionOutcomeChanged('DF', 1));
      expect(result.safetyQuestions[1].outcome).toEqual('DF');
    });
  });

  describe('BALANCE_QUESTION_SELECTED', () => {
    it('should add the balance question in the payload to the array at the specified index', () => {
      const newQuestionPayload: QuestionResult = {
        code: 'B01',
        description: 'desc',
      };
      const state: SafetyAndBalanceQuestions = cloneDeep(initialState);
      const result = safetyAndBalanceCatAMod2Reducer(state, BalanceQuestionSelected(newQuestionPayload, 0));
      expect(result.balanceQuestions[0].code).toEqual('B01');
      expect(result.balanceQuestions[0].description).toEqual('desc');
    });
  });

  describe('BALANCE_QUESTION_OUTCOME_CHANGED', () => {
    it('should update the outcome property for the object at the specified index', () => {
      const state: SafetyAndBalanceQuestions = cloneDeep(initialState);
      state.balanceQuestions[1] = {
        code: 'B01',
        description: 'desc',
        outcome: 'P',
      };
      const result = safetyAndBalanceCatAMod2Reducer(state, BalanceQuestionOutcomeChanged('DF', 1));
      expect(result.balanceQuestions[1].outcome).toEqual('DF');
    });
  });

  describe('ADD_SAFETY_AND_BALANCE_COMMENT', () => {
    it('should update the safety and balance comments', () => {
      const state: SafetyAndBalanceQuestions = cloneDeep(initialState);
      const result = safetyAndBalanceCatAMod2Reducer(state, AddSafetyAndBalanceComment('Fell over twice.'));

      expect(result.safetyAndBalanceComments).toEqual('Fell over twice.');
    });
  });
});
