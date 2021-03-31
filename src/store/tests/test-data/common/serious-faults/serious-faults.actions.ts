import { createAction, props } from '@ngrx/store';
import { Competencies } from '../../test-data.constants';

export const AddSeriousFault = createAction(
  '[Competency] Add Serious Fault',
  props<{ payload: Competencies }>()
);

export const RemoveSeriousFault = createAction(
  '[Competency] Remove Serious Fault',
  props<{ payload: Competencies }>()
);

export const AddSeriousFaultComment = createAction(
  '[Office] Add Serious Fault Comment',
  props<{ competencyName: string, comment: string }>()
);
