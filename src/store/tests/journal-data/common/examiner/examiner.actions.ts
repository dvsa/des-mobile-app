import { createAction, props } from '@ngrx/store';
import { Examiner } from '@dvsa/mes-test-schema/categories/common';

export const PopulateExaminer = createAction(
  '[ExaminerEffects] Populate Examiner',
  props<{ payload: Examiner }>()
);
