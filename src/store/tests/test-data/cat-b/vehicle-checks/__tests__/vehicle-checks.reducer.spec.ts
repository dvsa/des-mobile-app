import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CompetencyOutcome } from 'src/app/shared/models/competency-outcome';
import { VehicleChecksQuestion } from 'src/app/providers/question/vehicle-checks-question.model';
import { vehicleChecksReducer } from '../vehicle-checks.reducer';
import {
  TellMeQuestionSelected,
  TellMeQuestionDrivingFault,
  AddShowMeTellMeComment,
  TellMeQuestionCorrect,
  ShowMeQuestionSelected,
  ShowMeQuestionPassed,
  ShowMeQuestionDrivingFault,
  ShowMeQuestionSeriousFault,
  ShowMeQuestionDangerousFault,
  ShowMeQuestionRemoveFault,
} from '../vehicle-checks.actions';

describe('Vehicle Checks Reducer', () => {

  describe('TELL_ME_QUESTION_SELECTED', () => {
    it('should set the tell me question details', () => {
      const newQuestionPayload: VehicleChecksQuestion = {
        code: 'S1',
        description: 'desc',
        shortName: 'name',
      };
      const state: CatBUniqueTypes.VehicleChecks = {};

      const result = vehicleChecksReducer(state, TellMeQuestionSelected(newQuestionPayload));
      expect(result.tellMeQuestion.code).toEqual('S1');
      expect(result.tellMeQuestion.description).toEqual('name');
    });
    it('should set the question details and reset outcome when a tell me question is selected', () => {
      const newQuestionPayload: VehicleChecksQuestion = {
        code: 'T1',
        description: 'desc',
        shortName: 'name',
      };
      const state: CatBUniqueTypes.VehicleChecks = {
        tellMeQuestion: {
          code: 'T2',
          description: 'desc2',
          outcome: CompetencyOutcome.P,
        },
      };
      const result = vehicleChecksReducer(state, TellMeQuestionSelected(newQuestionPayload));
      expect(result.tellMeQuestion.code).toEqual('T1');
      expect(result.tellMeQuestion.description).toEqual('name');
      expect(result.tellMeQuestion.outcome).toBeUndefined();
    });
  });

  describe('TELL_ME_QUESTION_CORRECT', () => {
    it('should mark tell me question as pass when the action is received', () => {
      const state: CatBUniqueTypes.VehicleChecks = {};
      const result = vehicleChecksReducer(state, TellMeQuestionCorrect());
      expect(result.tellMeQuestion.outcome).toEqual(CompetencyOutcome.P);
    });
  });

  describe('TELL_ME_QUESTION_DRIVING_FAULT', () => {
    it('should mark tell me question as driving fault when the action is received', () => {
      const state: CatBUniqueTypes.VehicleChecks = {};
      const result = vehicleChecksReducer(state, TellMeQuestionDrivingFault());
      expect(result.tellMeQuestion.outcome).toEqual(CompetencyOutcome.DF);
    });
  });

  describe('ADD_SHOW_ME_TELL_ME_COMMENT', () => {
    it('should add a comment', () => {
      const state: CatBUniqueTypes.VehicleChecks = {};
      const result = vehicleChecksReducer(state, AddShowMeTellMeComment('Test'));
      expect(result.showMeTellMeComments).toEqual('Test');
    });
  });

  describe('SHOW_ME_QUESTION_SELECTED', () => {
    it('should set the show me question details', () => {
      const newQuestionPayload: VehicleChecksQuestion = {
        code: 'S1',
        description: 'desc',
        shortName: 'name',
      };
      const state: CatBUniqueTypes.VehicleChecks = {};

      const result = vehicleChecksReducer(state, ShowMeQuestionSelected(newQuestionPayload));
      expect(result.showMeQuestion.code).toEqual('S1');
      expect(result.showMeQuestion.description).toEqual('name');
    });
    it('should update the show me question details', () => {
      const newQuestionPayload: VehicleChecksQuestion = {
        code: 'S1',
        description: 'desc',
        shortName: 'name',
      };
      const state: CatBUniqueTypes.VehicleChecks = {
        showMeQuestion: {
          outcome: 'S',
          code: 'S2',
          description: 'desc2',
        },
      };
      const result = vehicleChecksReducer(state, ShowMeQuestionSelected(newQuestionPayload));
      expect(result.showMeQuestion.code).toEqual('S1');
      expect(result.showMeQuestion.outcome).toEqual('S');
      expect(result.showMeQuestion.description).toEqual('name');
    });
  });

  describe('SHOW_ME_QUESTION_PASSED', () => {
    it('should mark show me question as a pass', () => {
      const state: CatBUniqueTypes.VehicleChecks = {};
      const result = vehicleChecksReducer(state, ShowMeQuestionPassed());
      expect(result.showMeQuestion.outcome).toEqual(CompetencyOutcome.P);
    });
  });

  describe('SHOW_ME_QUESTION_DRIVING_FAULT', () => {
    it('should mark show me question as driving fault when the action is received', () => {
      const state: CatBUniqueTypes.VehicleChecks = {};
      const result = vehicleChecksReducer(state, ShowMeQuestionDrivingFault());
      expect(result.showMeQuestion.outcome).toEqual(CompetencyOutcome.DF);
    });
  });

  describe('SHOW_ME_QUESTION_SERIOUS_FAULT', () => {
    it('should mark show me question as serious fault when the action is received', () => {
      const state: CatBUniqueTypes.VehicleChecks = {};
      const result = vehicleChecksReducer(state, ShowMeQuestionSeriousFault());
      expect(result.showMeQuestion.outcome).toEqual(CompetencyOutcome.S);
    });
  });

  describe('SHOW_ME_QUESTION_DANGEROUS_FAULT', () => {
    it('should mark show me question as dangerous fault when the action is received', () => {
      const state: CatBUniqueTypes.VehicleChecks = {};
      const result = vehicleChecksReducer(state, ShowMeQuestionDangerousFault());
      expect(result.showMeQuestion.outcome).toEqual(CompetencyOutcome.D);
    });
  });

  describe('SHOW_ME_QUESTION_REMOVE_FAULT', () => {
    it('should remove the show me question fault the action is received', () => {
      const state: CatBUniqueTypes.VehicleChecks = {
        showMeQuestion: {
          code: '1',
          description: '2',
          outcome: CompetencyOutcome.D,
        },
      };
      const result = vehicleChecksReducer(state, ShowMeQuestionRemoveFault());
      expect(result.showMeQuestion.code).toEqual('1');
      expect(result.showMeQuestion.description).toEqual('2');
      expect(result.showMeQuestion.outcome).toBeUndefined();
    });
  });
});
