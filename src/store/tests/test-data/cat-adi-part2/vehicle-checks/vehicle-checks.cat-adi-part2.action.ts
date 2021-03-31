import { Action } from '@ngrx/store';
import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';

export const SHOW_ME_QUESTION_SELECTED = '[VehicleChecksPage] [CatADI2] Show Me Question Selected';
export const SHOW_ME_QUESTION_OUTCOME_CHANGED = '[VehicleChecksPage] [CatADI2] Show Me Question Outcome Changed';
export const TELL_ME_QUESTION_SELECTED = '[VehicleChecksPage] [CatADI2] Tell Me Question Selected';
export const TELL_ME_QUESTION_OUTCOME_CHANGED = '[VehicleChecksPage] [CatADI2] Tell Me Question Outcome Changed';
export const SHOW_ME_QUESTION_ADD_DRIVING_FAULT = '[Vehicle Checks] [CatADI2] Show Me Question Add Driving Fault';
export const SHOW_ME_QUESTION_REMOVE_DRIVING_FAULT = '[Vehicle Checks] [CatADI2] Show Me Question Remove Driving Fault';
export const VEHICLE_CHECKS_ADD_SERIOUS_FAULT = '[Vehicle Checks] [CatADI2] Vehicle Checks Add Serious Fault';
export const VEHICLE_CHECKS_REMOVE_SERIOUS_FAULT = '[Vehicle Checks] [CatADI2] Vehicle Checks Remove Serious Fault';
export const VEHICLE_CHECKS_ADD_DANGEROUS_FAULT = '[Vehicle Checks] [CatADI2] Vehicle Checks Add Dangerous Fault';
export const VEHICLE_CHECKS_REMOVE_DANGEROUS_FAULT = '[Vehicle Checks] [CatADI2] Vehicle Checks Remove Dangerous Fault';
export const ADD_SHOW_ME_TELL_ME_COMMENT = '[Vehicle Checks] [CatADI2] Add Show Me / Tell Me comment';
export const VEHICLE_CHECKS_TOGGLE = '[Vehicle Checks] [CatADI2] Vehicle Checks Completed Toggled';

export class ShowMeQuestionSelected implements Action {
  readonly type = SHOW_ME_QUESTION_SELECTED;
  constructor(public showMeQuestion: QuestionResult, public index: number) {}
}

export class VehicleChecksCompletedToggle implements Action {
  readonly type = VEHICLE_CHECKS_TOGGLE;
}

export class ShowMeQuestionOutcomeChanged implements Action {
  readonly type = SHOW_ME_QUESTION_OUTCOME_CHANGED;
  constructor(public showMeQuestionOutcome: QuestionOutcome, public index: number) {}
}

export class TellMeQuestionSelected implements Action {
  readonly type = TELL_ME_QUESTION_SELECTED;
  constructor(public tellMeQuestion: QuestionResult, public index: number) {}
}

export class TellMeQuestionOutcomeChanged implements Action {
  constructor(public tellMeQuestionOutcome: QuestionOutcome, public index: number) {}
  readonly type = TELL_ME_QUESTION_OUTCOME_CHANGED;
}
export class AddShowMeTellMeComment implements Action {
  constructor(public comment: string) { }
  readonly type = ADD_SHOW_ME_TELL_ME_COMMENT;
}

export class ShowMeQuestionAddDrivingFault implements Action {
  constructor(public index: number) {}
  readonly type = SHOW_ME_QUESTION_ADD_DRIVING_FAULT;
}

export class ShowMeQuestionRemoveDrivingFault implements Action {
  constructor(public index: number) {}
  readonly type = SHOW_ME_QUESTION_REMOVE_DRIVING_FAULT;
}

export class VehicleChecksAddSeriousFault implements Action {
  readonly type = VEHICLE_CHECKS_ADD_SERIOUS_FAULT;
}

export class VehicleChecksAddDangerousFault implements Action {
  readonly type = VEHICLE_CHECKS_ADD_DANGEROUS_FAULT;
}

export class VehicleChecksRemoveSeriousFault implements Action {
  readonly type = VEHICLE_CHECKS_REMOVE_SERIOUS_FAULT;
}

export class VehicleChecksRemoveDangerousFault implements Action {
  readonly type = VEHICLE_CHECKS_REMOVE_DANGEROUS_FAULT;
}

export type Types =
  | ShowMeQuestionSelected
  | ShowMeQuestionOutcomeChanged
  | TellMeQuestionSelected
  | TellMeQuestionOutcomeChanged
  | AddShowMeTellMeComment
  | ShowMeQuestionAddDrivingFault
  | ShowMeQuestionRemoveDrivingFault
  | VehicleChecksAddSeriousFault
  | VehicleChecksAddDangerousFault
  | VehicleChecksRemoveSeriousFault
  | VehicleChecksRemoveDangerousFault
  | VehicleChecksCompletedToggle;
