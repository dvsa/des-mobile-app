import { createAction } from '@ngrx/store';
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
  (manoeuvre: ManoeuvreTypes, index: number) => ({ manoeuvre, index }),
);

export const RecordManoeuvresSelection = createAction(
  '[Manoeuvres] [Cat ADI2] Record Manoeuvre Selection',
  (manoeuvre: ManoeuvreTypes, index: number) => ({ manoeuvre, index }),
);

export const AddManoeuvreDrivingFault = createAction(
  '[Manoeuvres] [Cat ADI2] Add Manoeuvre Driving Fault',
  (payload: ManoeuvrePayload, index: number) => ({ payload, index }),
);

export const AddManoeuvreSeriousFault = createAction(
  '[Manoeuvres] [Cat ADI2] Add Manoeuvre Serious Fault',
  (payload: ManoeuvrePayload, index: number) => ({ payload, index }),
);

export const AddManoeuvreDangerousFault = createAction(
  '[Manoeuvres] [Cat ADI2] Add Manoeuvre Dangerous Fault',
  (payload: ManoeuvrePayload, index: number) => ({ payload, index }),
);

export const AddManoeuvreComment = createAction(
  '[Manoeuvres] [Cat ADI2] Add Manoeuvre Comment',
  (
    fieldName: string,
    faultType: CompetencyOutcome,
    controlOrObservation: string,
    comment: string,
    index: number,
  ) => ({
    fieldName,
    faultType,
    controlOrObservation,
    comment,
    index,
  }),
);

export const RemoveManoeuvreFault = createAction(
  '[Manoeuvres] [Cat ADI2] Remove Manoeuvre Fault',
  (payload: ManoeuvrePayload, index: number) => ({ payload, index }),
);
