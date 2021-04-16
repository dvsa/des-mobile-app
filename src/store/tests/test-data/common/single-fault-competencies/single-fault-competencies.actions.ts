import { createAction } from '@ngrx/store';
import { SingleFaultCompetencyOutcome } from '@dvsa/mes-test-schema/categories/AM1';
import { SingleFaultCompetencyNames } from '../../test-data.constants';

export const SetSingleFaultCompetencyOutcome = createAction(
  '[Single Fault Competency] Set Outcome',
  (SingleFaultCompetencyNames: SingleFaultCompetencyNames,
   SingleFaultCompetencyOutcome: SingleFaultCompetencyOutcome) =>
    ({
      SingleFaultCompetencyNames,
      SingleFaultCompetencyOutcome,
    }),
);

export const RemoveSingleFaultCompetencyOutcome = createAction(
  '[Single Fault Competency] Remove Outcome',
  (competencyName: SingleFaultCompetencyNames) => ({ competencyName }),
);

export const RemoveSingleSeriousFaultCompetencyOutcome = createAction(
  '[Single Fault Competency] Remove Serious Outcome',
  (competencyName: SingleFaultCompetencyNames) => ({ competencyName }),
);

export const RemoveSingleDangerousFaultCompetencyOutcome = createAction(
  '[Single Fault Competency] Remove Dangerous Outcome',
  (competencyName: SingleFaultCompetencyNames) => ({ competencyName }),
);

export const AddSingleFaultCompetencyComment = createAction(
  '[Single Fault Competency] Add Comment',
  (competencyName: SingleFaultCompetencyNames,
   comment: string) =>
    ({
      SingleFaultCompetencyNames,
      comment,
    }),
);
