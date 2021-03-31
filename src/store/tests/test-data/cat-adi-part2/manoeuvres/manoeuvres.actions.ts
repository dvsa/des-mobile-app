import { Action } from '@ngrx/store';

import {
  ManoeuvreTypes,
  ManoeuvreCompetencies,
} from '../../test-data.constants';

import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';

export const RECORD_MANOEUVRES_SELECTION = '[Manoeuvres] [Cat ADI2] Record Manoeuvres Selection';
export const RECORD_MANOEUVRES_DESELECTION = '[Manoeuvres] [Cat ADI2] Record Manoeuvre Deselection';
export const ADD_MANOEUVRE_DRIVING_FAULT = '[Manoeuvres] [Cat ADI2] Add Manoeuvre Driving Fault';
export const ADD_MANOEUVRE_SERIOUS_FAULT = '[Manoeuvres] [Cat ADI2] Add Manoeuvre Serious Fault';
export const ADD_MANOEUVRE_DANGEROUS_FAULT = '[Manoeuvres] [Cat ADI2] Add Manoeuvre Dangerous Fault';
export const ADD_MANOEUVRE_COMMENT = '[Manoeuvres] [Cat ADI2] Add Manoeuvre Comment';
export const REMOVE_MANOEUVRE_FAULT = '[Manoeuvres] [Cat ADI2] Remove Manoeuvre Fault';

export interface ManoeuvrePayload {
  manoeuvre: ManoeuvreTypes;
  competency: ManoeuvreCompetencies;
}

export class RecordManoeuvresDeselection implements Action {
  constructor(public manoeuvre: ManoeuvreTypes, public index: number) { }
  readonly type = RECORD_MANOEUVRES_DESELECTION;
}

export class RecordManoeuvresSelection implements Action {
  constructor(public manoeuvre: ManoeuvreTypes, public index: number) { }
  readonly type = RECORD_MANOEUVRES_SELECTION;
}

export class AddManoeuvreDrivingFault implements Action {
  constructor(public payload: ManoeuvrePayload, public index: number) { }
  readonly type = ADD_MANOEUVRE_DRIVING_FAULT;
}

export class AddManoeuvreSeriousFault implements Action {
  constructor(public payload: ManoeuvrePayload, public index: number) { }
  readonly type = ADD_MANOEUVRE_SERIOUS_FAULT;
}

export class AddManoeuvreDangerousFault implements Action {
  constructor(public payload: ManoeuvrePayload, public index: number) { }
  readonly type = ADD_MANOEUVRE_DANGEROUS_FAULT;
}

export class AddManoeuvreComment implements Action {
  constructor(
    public fieldName: string,
    public faultType: CompetencyOutcome,
    public controlOrObservation: string,  // 'Control' | 'Observation',
    public comment: string,
    public index: number) { }
  readonly type = ADD_MANOEUVRE_COMMENT;
}

export class RemoveManoeuvreFault implements Action {
  constructor(public payload: ManoeuvrePayload, public index: number) { }
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
