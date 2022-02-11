import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { cloneDeep } from 'lodash';
import {
  ShowMeQuestionSelected,
  ShowMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
} from '../vehicle-checks.cat-d.action';
import {
  vehicleChecksCatDReducer, generateInitialState,
} from '../vehicle-checks.cat-d.reducer';

describe('Vehicle Checks Cat D Reducer', () => {

  describe('SHOW_ME_QUESTION_SELECTED', () => {
    it('should add the show me question in the payload to the array at the specified index', () => {
      const newQuestionPayload: QuestionResult = {
        code: 'S1',
        description: 'desc',
      };
      const state: CatDUniqueTypes.VehicleChecks = cloneDeep(generateInitialState());
      const result = vehicleChecksCatDReducer(state, ShowMeQuestionSelected(newQuestionPayload, 1));
      expect(result.showMeQuestions[1].code).toEqual('S1');
      expect(result.showMeQuestions[1].description).toEqual('desc');
    });
  });

  describe('SHOW_ME_QUESTION_OUTCOME_CHANGED', () => {
    it('should update the outcome property for the object at the specified index', () => {
      const state: CatDUniqueTypes.VehicleChecks = cloneDeep(generateInitialState());
      state.showMeQuestions[1] = {
        code: 'S1',
        description: 'desc',
        outcome: 'P',
      };
      const result = vehicleChecksCatDReducer(state, ShowMeQuestionOutcomeChanged('DF', 1));
      expect(result.showMeQuestions[1].outcome).toEqual('DF');
    });
  });

  describe('TELL_ME_QUESTION_SELECTED', () => {
    it('should add the tell me question in the payload to the array at the specified index', () => {
      const newQuestionPayload: QuestionResult = {
        code: 'T01',
        description: 'desc',
      };
      const state: CatDUniqueTypes.VehicleChecks = cloneDeep(generateInitialState());
      const result = vehicleChecksCatDReducer(state, TellMeQuestionSelected(newQuestionPayload, 1));
      expect(result.tellMeQuestions[1].code).toEqual('T01');
      expect(result.tellMeQuestions[1].description).toEqual('desc');
    });
  });

  describe('TELL_ME_QUESTION_OUTCOME_CHANGED', () => {
    it('should update the outcome property for the object at the specified index', () => {
      const state: CatDUniqueTypes.VehicleChecks = cloneDeep(generateInitialState());
      state.tellMeQuestions[1] = {
        code: 'T01',
        description: 'desc',
        outcome: 'P',
      };
      const result = vehicleChecksCatDReducer(state, TellMeQuestionOutcomeChanged('DF', 1));
      expect(result.tellMeQuestions[1].outcome).toEqual('DF');
    });
  });
});
