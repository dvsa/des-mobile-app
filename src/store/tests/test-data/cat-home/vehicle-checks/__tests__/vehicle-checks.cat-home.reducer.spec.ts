import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';

import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { cloneDeep } from 'lodash';
import {
  initialState,
  vehicleChecksCatHomeReducer,
} from '../vehicle-checks.cat-home.reducer';
import {
  ShowMeQuestionSelected,
  ShowMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  AddShowMeTellMeComment,
} from '../vehicle-checks.cat-home.actions';

describe('Vehicle Checks Cat HOME Reducer', () => {

  describe('SHOW_ME_QUESTION_SELECTED', () => {
    it('should add the show me question in the payload to the array at the specified index', () => {
      const newQuestionPayload: QuestionResult = {
        code: 'S1',
        description: 'desc',
      };
      const state: CatFUniqueTypes.VehicleChecks = cloneDeep(initialState);
      const result = vehicleChecksCatHomeReducer(state, ShowMeQuestionSelected(newQuestionPayload, 0));
      expect(result.showMeQuestions[0].code).toEqual('S1');
      expect(result.showMeQuestions[0].description).toEqual('desc');
    });
  });

  describe('SHOW_ME_QUESTION_OUTCOME_CHANGED', () => {
    it('should update the outcome property for the object at the specified index', () => {
      const state: CatFUniqueTypes.VehicleChecks = cloneDeep(initialState);
      state.showMeQuestions[1] = {
        code: 'S1',
        description: 'desc',
        outcome: 'P',
      };
      const result = vehicleChecksCatHomeReducer(state, ShowMeQuestionOutcomeChanged('DF', 1));
      expect(result.showMeQuestions[1].outcome).toEqual('DF');
    });
  });

  describe('TELL_ME_QUESTION_SELECTED', () => {
    it('should add the tell me question in the payload to the array at the specified index', () => {
      const newQuestionPayload: QuestionResult = {
        code: 'T01',
        description: 'desc',
      };
      const state: CatFUniqueTypes.VehicleChecks = cloneDeep(initialState);
      const result = vehicleChecksCatHomeReducer(state, TellMeQuestionSelected(newQuestionPayload, 0));
      expect(result.tellMeQuestions[0].code).toEqual('T01');
      expect(result.tellMeQuestions[0].description).toEqual('desc');
    });
  });

  describe('TELL_ME_QUESTION_OUTCOME_CHANGED', () => {
    it('should update the outcome property for the object at the specified index', () => {
      const state: CatFUniqueTypes.VehicleChecks = cloneDeep(initialState);
      state.tellMeQuestions[1] = {
        code: 'T01',
        description: 'desc',
        outcome: 'P',
      };
      const result = vehicleChecksCatHomeReducer(state, TellMeQuestionOutcomeChanged('DF', 1));
      expect(result.tellMeQuestions[1].outcome).toEqual('DF');
    });
  });

  describe('ADD_SHOW_ME_TELL_ME_COMMENT', () => {
    it('should update the vehicle checks comments', () => {
      const state: CatFUniqueTypes.VehicleChecks = cloneDeep(initialState);
      const result = vehicleChecksCatHomeReducer(state, AddShowMeTellMeComment('So many mistakes.'));

      expect(result.showMeTellMeComments).toEqual('So many mistakes.');
    });
  });
});
