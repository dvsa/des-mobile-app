import { Examiner } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';

export const PopulateExaminer = createAction('[ExaminerEffects] Populate Examiner', (examiner: Examiner) => ({
  examiner,
}));
