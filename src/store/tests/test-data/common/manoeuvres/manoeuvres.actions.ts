import { createAction } from '@ngrx/store';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

import {
  ManoeuvreTypes,
  ManoeuvreCompetencies,
} from '../../test-data.constants';

export interface ManoeuvrePayload {
  manoeuvre: ManoeuvreTypes;
  competency: ManoeuvreCompetencies;
}

export const RecordManoeuvresDeselection = createAction(
  '[Manoeuvres] Deselect Reverse Left Manoeuvre',
  (manoeuvre: ManoeuvreTypes) => ({ manoeuvre }),
);

export const RecordManoeuvresSelection = createAction(
  '[Manoeuvres] Record Manoeuvres Selection',
  (manoeuvre: ManoeuvreTypes) => ({ manoeuvre }),
);

export const AddManoeuvreDrivingFault = createAction(
  '[Manoeuvres] Add Manoeuvre Driving Fault',
  (manoeuvrePayload: ManoeuvrePayload) => ({ manoeuvrePayload }),
);

export const AddManoeuvreSeriousFault = createAction(
  '[Manoeuvres] Add Manoeuvre Serious Fault',
  (manoeuvrePayload: ManoeuvrePayload) => ({ manoeuvrePayload }),
);

export const AddManoeuvreDangerousFault = createAction(
  '[Manoeuvres] Add Manoeuvre Dangerous Fault',
  (manoeuvrePayload: ManoeuvrePayload) => ({ manoeuvrePayload }),
);

export const AddManoeuvreComment = createAction(
  '[Manoeuvres] Add Manoeuvre Comment',
  (
    fieldName: string,
    faultType: CompetencyOutcome,
    controlOrObservation: string,
    comment: string,
  ) => ({
    fieldName,
    faultType,
    controlOrObservation,
    comment,
  }),
);

export const RemoveManoeuvreFault = createAction(
  '[Manoeuvres] Remove Manoeuvre Fault',
  (payload: ManoeuvrePayload, faultLevel: CompetencyOutcome) => ({ payload, faultLevel }),
);
