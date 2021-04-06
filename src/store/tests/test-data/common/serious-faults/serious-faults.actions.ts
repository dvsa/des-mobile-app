import { createAction } from '@ngrx/store';
import { Competencies } from '../../test-data.constants';

export const AddSeriousFault = createAction(
  '[Competency] Add Serious Fault',
  (competency: Competencies) => ({ competency }),
);

export const RemoveSeriousFault = createAction(
  '[Competency] Remove Serious Fault',
  (competency: Competencies) => ({ competency }),
);

export const AddSeriousFaultComment = createAction(
  '[Office] Add Serious Fault Comment',
  (competencyName: string, comment: string) => ({ competencyName, comment }),
);
