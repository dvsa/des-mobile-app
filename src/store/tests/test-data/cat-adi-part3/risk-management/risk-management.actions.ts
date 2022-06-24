import { createAction } from '@ngrx/store';

export const RiskManagementOverallScoreChanged = createAction(
  '[RiskManagement] Score changed',
  (score: number) => ({ score }),
);

export const RiskManagementQuestionScoreChanged = createAction(
  '[RiskManagement] Question score changed',
  (question: number, score: number) => ({ question, score }),
);
