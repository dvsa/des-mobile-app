import { createAction, props } from '@ngrx/store';
import { ExaminerActions } from '../../test-data.constants';

export const ToggleETA = createAction(
  '[Eta] Toggle Eta',
  props<{ payload: ExaminerActions }>(),
);
