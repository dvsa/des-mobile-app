import { RiskManagement } from '@dvsa/mes-test-schema/categories/ADI3';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { riskManagement } from '@shared/constants/adi3-questions/risk-management.constants';
import * as riskManagementActions from './risk-management.actions';

export const initialState: RiskManagement = {
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
  score: 0,
};

export const riskManagementReducer = createReducer(
  initialState,
  on(riskManagementActions.RiskManagementQuestionScoreChanged, (state, { question, score }): RiskManagement => ({
    ...state,
    [`q${question}`]: {
      ...state[`q${question}`],
      score,
    },
  })),
  on(riskManagementActions.RiskManagementOverallScoreChanged, (state, { score }): RiskManagement => ({
    ...state,
    score,
  })),
);

export const getRiskManagement = createFeatureSelector<RiskManagement>('riskManagement');
