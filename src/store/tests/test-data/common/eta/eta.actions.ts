import { createAction } from '@ngrx/store';
import { ExaminerActions } from '../../test-data.constants';

export const ToggleETA = createAction(
  '[Eta] Toggle Eta',
  (examinerAction: ExaminerActions) => ({ examinerAction }),
);
