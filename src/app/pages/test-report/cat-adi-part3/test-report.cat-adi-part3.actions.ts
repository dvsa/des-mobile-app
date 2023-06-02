import { createAction } from '@ngrx/store';

export const AssessmentOverallScoreChanged = createAction(
  '[TestReportPage] Assessment Overall Score Changed',
  (score: string | number) => ({ score }),
);
