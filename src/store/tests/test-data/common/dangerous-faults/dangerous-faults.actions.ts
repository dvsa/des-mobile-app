import { createAction } from '@ngrx/store';
import { Competencies } from '../../test-data.constants';

export const AddDangerousFault = createAction(
  '[Competency] Add Dangerous Fault',
  (competency: Competencies) => ({ competency }),
);

export const RemoveDangerousFault = createAction(
  '[Competency] Remove Dangerous Fault',
  (competency: Competencies) => ({ competency }),
);

export const AddDangerousFaultComment = createAction(
  '[Office] Add Dangerous Fault Comment',
  (competencyName: string, comment: string) => ({ competencyName, comment }),
);
