import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { cloneDeep } from 'lodash';
import { VehicleChecks } from '@dvsa/mes-test-schema/categories/ADI2/partial';
import * as vehicleChecksCatADI2ActionTypes from '../vehicle-checks.cat-adi-part2.action';
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
      const result = vehicleChecksCatADI2Reducer(state, TellMeQuestionSelected(newQuestionPayload, 1));
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
      const result = vehicleChecksCatADI2Reducer(state, TellMeQuestionOutcomeChanged('DF', 1));
      expect(result.tellMeQuestions[1].outcome).toEqual('DF');
    });
  });

  describe('ADD_SHOW_ME_TELL_ME_COMMENT', () => {
    it('should update the vehicle checks comments', () => {
      const state: CatADI2UniqueTypes.VehicleChecks = cloneDeep(initialState);
      const result = vehicleChecksCatADI2Reducer(state, AddShowMeTellMeComment('So many mistakes.'));

      expect(result.showMeTellMeComments).toEqual('So many mistakes.');
    });
  });

  describe('VehicleChecksAddSeriousFault', () => {
    it('should set seriousFault to true', () => {
      const result = vehicleChecksCatADI2Reducer(
        {}, vehicleChecksCatADI2ActionTypes.VehicleChecksAddSeriousFault(),
      );
      expect(result).toEqual({ seriousFault: true });
    });
  });

  describe('VehicleChecksAddDangerousFault', () => {
    it('should set dangerousFault to true', () => {
      const result = vehicleChecksCatADI2Reducer(
        {}, vehicleChecksCatADI2ActionTypes.VehicleChecksAddDangerousFault(),
      );
      expect(result).toEqual({ dangerousFault: true });
    });
  });

  describe('VehicleChecksRemoveSeriousFault', () => {
    it('should set seriousFault to false', () => {
      const result = vehicleChecksCatADI2Reducer(
        {}, vehicleChecksCatADI2ActionTypes.VehicleChecksRemoveSeriousFault(),
      );
      expect(result).toEqual({ seriousFault: false });
    });
  });

  describe('VehicleChecksAddDangerousFault', () => {
    it('should set dangerousFault to false', () => {
      const result = vehicleChecksCatADI2Reducer(
        {}, vehicleChecksCatADI2ActionTypes.VehicleChecksRemoveDangerousFault(),
      );
      expect(result).toEqual({ dangerousFault: false });
    });
  });

  describe('VehicleChecksCompletedToggle', () => {
    it('should toggle vehicleChecksCompleted', () => {

      let result: VehicleChecks = { vehicleChecksCompleted: false };
      result = vehicleChecksCatADI2Reducer(
        result, vehicleChecksCatADI2ActionTypes.VehicleChecksCompletedToggle(),
      );
      expect(result).toEqual({ vehicleChecksCompleted: true });
    });
  });
});
