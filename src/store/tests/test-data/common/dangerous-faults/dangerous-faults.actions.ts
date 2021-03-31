import { createAction, props } from '@ngrx/store';
import { Competencies } from '../../test-data.constants';

export const AddDangerousFault = createAction(
  '[Competency] Add Dangerous Fault',
  props<{ payload: Competencies }>(),
);

export const RemoveDangerousFault = createAction(
  '[Competency] Remove Dangerous Fault',
  props<{ payload: Competencies }>(),
);

export const AddDangerousFaultComment = createAction(
  '[Office] Add Dangerous Fault Comment',
  props<{ competencyName: string, comment: string }>(),
);
