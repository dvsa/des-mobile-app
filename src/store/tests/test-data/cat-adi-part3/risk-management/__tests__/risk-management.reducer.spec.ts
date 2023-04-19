import {
  riskManagementReducer,
  initialState,
} from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.reducer';
import { riskManagement } from '@shared/constants/adi3-questions/risk-management.constants';
import * as riskManagementActions from '../risk-management.actions';

describe('riskManagementReducer', () => {
  describe('RiskManagementQuestionScoreChanged', () => {
    it('should set the score of the question passed to the value passed', () => {
      const result = riskManagementReducer(
        initialState, riskManagementActions.RiskManagementQuestionScoreChanged(1, 1),
      );
      expect(result).toEqual({
        q1: {
          title: riskManagement.q1,
          score: 1,
        },
        q2: {
          title: riskManagement.q2,
          score: null,
        },
        q3: {
          title: riskManagement.q3,
          score: null,
        },
        q4: {
          title: riskManagement.q4,
          score: null,
        },
        q5: {
          title: riskManagement.q5,
          score: null,
        },
        score: 0,
      });
    });
  }); describe('RiskManagementOverallScoreChanged', () => {
    it('should set the overall score to the value passed', () => {
      const result = riskManagementReducer(
        initialState, riskManagementActions.RiskManagementOverallScoreChanged(1),
      );
      expect(result).toEqual({
        q1: {
          title: riskManagement.q1,
          score: null,
        },
        q2: {
          title: riskManagement.q2,
          score: null,
        },
        q3: {
          title: riskManagement.q3,
          score: null,
        },
        q4: {
          title: riskManagement.q4,
          score: null,
        },
        q5: {
          title: riskManagement.q5,
          score: null,
        },
        score: 1,
      });
    });
  });
});
