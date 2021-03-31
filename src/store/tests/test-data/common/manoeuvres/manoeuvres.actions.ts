import { Action } from '@ngrx/store';

import {
  ManoeuvreTypes,
  ManoeuvreCompetencies,
} from '../../test-data.constants';

import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';

export const RECORD_MANOEUVRES_SELECTION = '[Manoeuvres] Record Manoeuvres Selection';
export const RECORD_MANOEUVRES_DESELECTION = '[Manoeuvres] Deselect Reverse Left Manoeuvre';
export const ADD_MANOEUVRE_DRIVING_FAULT = '[Manoeuvres] Add Manoeuvre Driving Fault';
export const ADD_MANOEUVRE_SERIOUS_FAULT = '[Manoeuvres] Add Manoeuvre Serious Fault';
export const ADD_MANOEUVRE_DANGEROUS_FAULT = '[Manoeuvres] Add Manoeuvre Dangerous Fault';
export const ADD_MANOEUVRE_COMMENT = '[Manoeuvres] Add Manoeuvre Comment';
export const REMOVE_MANOEUVRE_FAULT = '[Manoeuvres] Remove Manoeuvre Fault';

export interface ManoeuvrePayload {
  manoeuvre: ManoeuvreTypes;
  competency: ManoeuvreCompetencies;
}

export class RecordManoeuvresDeselection implements Action {
  constructor(public manoeuvre: ManoeuvreTypes) { }
  readonly type = RECORD_MANOEUVRES_DESELECTION;
}

export class RecordManoeuvresSelection implements Action {
  constructor(public manoeuvre: ManoeuvreTypes) { }
  readonly type = RECORD_MANOEUVRES_SELECTION;
}

export class AddManoeuvreDrivingFault implements Action {
  constructor(public payload: ManoeuvrePayload) { }
  readonly type = ADD_MANOEUVRE_DRIVING_FAULT;
}

export class AddManoeuvreSeriousFault implements Action {
  constructor(public payload: ManoeuvrePayload) { }
  readonly type = ADD_MANOEUVRE_SERIOUS_FAULT;
}

export class AddManoeuvreDangerousFault implements Action {
  constructor(public payload: ManoeuvrePayload) { }
  readonly type = ADD_MANOEUVRE_DANGEROUS_FAULT;
}

export class AddManoeuvreComment implements Action {
  constructor(
    public fieldName: string,
    public faultType: CompetencyOutcome,
    public controlOrObservation: string,  // 'Control' | 'Observation',
    public comment: string) { }
  readonly type = ADD_MANOEUVRE_COMMENT;
}

export class RemoveManoeuvreFault implements Action {
  constructor(public payload: ManoeuvrePayload) { }
  readonly type = REMOVE_MANOEUVRE_FAULT;
}

export type Types =
  | RecordManoeuvresDeselection
  | RecordManoeuvresSelection
  | AddManoeuvreDrivingFault
  | AddManoeuvreSeriousFault
  | AddManoeuvreDangerousFault
  | AddManoeuvreComment
  | RemoveManoeuvreFault;
