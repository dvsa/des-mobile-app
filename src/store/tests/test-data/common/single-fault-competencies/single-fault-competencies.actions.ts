import { Action } from '@ngrx/store';
import { SingleFaultCompetencyOutcome } from '@dvsa/mes-test-schema/categories/AM1';
import { SingleFaultCompetencyNames } from '../../test-data.constants';

export const SET_SINGLE_FAULT_COMPETENCY_OUTCOME = '[Single Fault Competency] Set Outcome';
export const REMOVE_SINGLE_FAULT_COMPETENCY_OUTCOME = '[Single Fault Competency] Remove Outcome';
export const REMOVE_SINGLE_SERIOUS_FAULT_COMPETENCY_OUTCOME = '[Single Fault Competency] Remove Serious Outcome';
export const REMOVE_SINGLE_DANGEROUS_FAULT_COMPETENCY_OUTCOME = '[Single Fault Competency] Remove Dangerous Outcome';
export const ADD_SINGLE_FAULT_COMPETENCY_COMMENT = '[Single Fault Competency] Add Comment';

export class SetSingleFaultCompetencyOutcome implements Action {
  constructor(public competencyName: SingleFaultCompetencyNames,
              public outcome: SingleFaultCompetencyOutcome) {
  }

  readonly type = SET_SINGLE_FAULT_COMPETENCY_OUTCOME;
}

export class RemoveSingleFaultCompetencyOutcome implements Action {
  constructor(public competencyName: SingleFaultCompetencyNames) {
  }

  readonly type = REMOVE_SINGLE_FAULT_COMPETENCY_OUTCOME;
}

export class RemoveSingleDangerousFaultCompetencyOutcome implements Action {
  constructor(public competencyName: SingleFaultCompetencyNames) {
  }

  readonly type = REMOVE_SINGLE_DANGEROUS_FAULT_COMPETENCY_OUTCOME;
}

export class RemoveSingleSeriousFaultCompetencyOutcome implements Action {
  constructor(public competencyName: SingleFaultCompetencyNames) {
  }

  readonly type = REMOVE_SINGLE_SERIOUS_FAULT_COMPETENCY_OUTCOME;
}

export class AddSingleFaultCompetencyComment implements Action {
  constructor(public competencyName: SingleFaultCompetencyNames,
              public comment: string) {
  }

  readonly type = ADD_SINGLE_FAULT_COMPETENCY_COMMENT;
}

export type Types =
  | SetSingleFaultCompetencyOutcome
  | RemoveSingleFaultCompetencyOutcome
  | AddSingleFaultCompetencyComment
  | RemoveSingleDangerousFaultCompetencyOutcome
  | RemoveSingleSeriousFaultCompetencyOutcome;
