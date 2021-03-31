import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { cloneDeep } from 'lodash';
import {
  initialState,
  vehicleChecksCatADI2Reducer,
} from '../vehicle-checks.cat-adi-part2.reducer';
import {
  TellMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  AddShowMeTellMeComment,
} from '../vehicle-checks.cat-adi-part2.action';

describe('Vehicle Checks Cat ADI2 Reducer', () => {

  describe('TELL_ME_QUESTION_SELECTED', () => {
    it('should add the tell me question in the payload to the array at the specified index', () => {
      const newQuestionPayload: QuestionResult = {
        code: 'T01',
        description: 'desc',
      };
      const state: CatADI2UniqueTypes.VehicleChecks = cloneDeep(initialState);
      const result = vehicleChecksCatADI2Reducer(state, TellMeQuestionSelected({
        tellMeQuestion: newQuestionPayload,
        index: 1
      }));
      expect(result.tellMeQuestions[1].code).toEqual('T01');
      expect(result.tellMeQuestions[1].description).toEqual('desc');
    });
  });

  describe('TELL_ME_QUESTION_OUTCOME_CHANGED', () => {
    it('should update the outcome property for the object at the specified index', () => {
      const state: CatADI2UniqueTypes.VehicleChecks = cloneDeep(initialState);
      state.tellMeQuestions[1] = {
        code: 'T01',
        description: 'desc',
        outcome: 'P',
      };
      const result = vehicleChecksCatADI2Reducer(state, TellMeQuestionOutcomeChanged({
        tellMeQuestionOutcome: 'DF',
        index: 1
      }));
      expect(result.tellMeQuestions[1].outcome).toEqual('DF');
    });
  });

  describe('ADD_SHOW_ME_TELL_ME_COMMENT', () => {
    it('should update the vehicle checks comments', () => {
      const state: CatADI2UniqueTypes.VehicleChecks = cloneDeep(initialState);
      const result = vehicleChecksCatADI2Reducer(state, AddShowMeTellMeComment({ payload: 'So many mistakes.' }));

      expect(result.showMeTellMeComments).toEqual('So many mistakes.');
    });
  });
});
