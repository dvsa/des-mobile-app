import { createAction, props } from '@ngrx/store';
import {
  ManoeuvreTypes,
  ManoeuvreCompetencies,
} from '../../test-data.constants';
import { CompetencyOutcome } from '../../../../../app/shared/models/competency-outcome';

export interface ManoeuvrePayload {
  manoeuvre: ManoeuvreTypes;
  competency: ManoeuvreCompetencies;
}

export const RecordManoeuvresDeselection = createAction(
  '[Manoeuvres] [Cat ADI2] Record Manoeuvre Deselection',
  props<{ manoeuvre: ManoeuvreTypes, index: number }>()
);

export const RecordManoeuvresSelection = createAction(
  '[Manoeuvres] [Cat ADI2] Record Manoeuvre Selection',
  props<{ manoeuvre: ManoeuvreTypes, index: number }>()
);

export const AddManoeuvreDrivingFault = createAction(
  '[Manoeuvres] [Cat ADI2] Add Manoeuvre Driving Fault',
  props<{ payload: ManoeuvrePayload, index: number }>()
);

export const AddManoeuvreSeriousFault = createAction(
  '[Manoeuvres] [Cat ADI2] Add Manoeuvre Serious Fault',
  props<{ payload: ManoeuvrePayload, index: number }>()
);

export const AddManoeuvreDangerousFault = createAction(
  '[Manoeuvres] [Cat ADI2] Add Manoeuvre Dangerous Fault',
  props<{ payload: ManoeuvrePayload, index: number }>()
);

export const AddManoeuvreComment = createAction(
  '[Manoeuvres] [Cat ADI2] Add Manoeuvre Comment',
  props<{
    fieldName: string,
    faultType: CompetencyOutcome,
    controlOrObservation: string,
    comment: string,
    index: number,
  }>()
);

export const RemoveManoeuvreFault = createAction(
  '[Manoeuvres] [Cat ADI2] Remove Manoeuvre Fault',
  props<{ payload: ManoeuvrePayload, index: number }>()
);
