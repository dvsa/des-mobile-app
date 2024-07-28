import { SingleFaultCompetencyOutcome } from '@dvsa/mes-test-schema/categories/AM1';
import { createAction } from '@ngrx/store';
import { SingleFaultCompetencyNames } from '../../test-data.constants';

export const SetSingleFaultCompetencyOutcome = createAction(
	'[Single Fault Competency] Set Outcome',
	(competencyName: SingleFaultCompetencyNames, outcome: SingleFaultCompetencyOutcome) => ({
		competencyName,
		outcome,
	})
);

export const RemoveSingleFaultCompetencyOutcome = createAction(
	'[Single Fault Competency] Remove Outcome',
	(competencyName: SingleFaultCompetencyNames) => ({ competencyName })
);

export const RemoveSingleSeriousFaultCompetencyOutcome = createAction(
	'[Single Fault Competency] Remove Serious Outcome',
	(competencyName: SingleFaultCompetencyNames) => ({ competencyName })
);

export const RemoveSingleDangerousFaultCompetencyOutcome = createAction(
	'[Single Fault Competency] Remove Dangerous Outcome',
	(competencyName: SingleFaultCompetencyNames) => ({ competencyName })
);

export const AddSingleFaultCompetencyComment = createAction(
	'[Single Fault Competency] Add Comment',
	(competencyName: SingleFaultCompetencyNames, comment: string) => ({
		competencyName,
		comment,
	})
);
