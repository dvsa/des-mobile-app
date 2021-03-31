import { createAction, props } from '@ngrx/store';
import { WeatherConditions, Identification, IndependentDriving } from '@dvsa/mes-test-schema/categories/common';

export const AdditionalInformationChanged = createAction(
  '[Test Summary] Additional Information changed',
  props<{ payload: string }>(),
);

export const CandidateDescriptionChanged = createAction(
  '[Test Summary] Candidate description changed',
  props<{ payload: string }>(),
);

export const RouteNumberChanged = createAction(
  '[Test Summary] Route Number changed',
  props<{ payload: number }>(),
);

export const DebriefWitnessed = createAction(
  '[Test Summary] Debrief Witnessed',
);

export const DebriefUnWitnessed = createAction(
  '[Test Summary] Debrief Un-witnessed',
);

export const IdentificationUsedChanged = createAction(
  '[Test Summary] Identification used changed',
  props<{ payload: Identification }>(),
);

export const IndependentDrivingTypeChanged = createAction(
  '[Test Summary] Independent driving changed',
  props<{ payload: IndependentDriving }>(),
);

export const D255Yes = createAction(
  '[Test Summary] D255 Yes',
);

export const D255No = createAction(
  '[Test Summary] D255 No',
);

export const WeatherConditionsChanged = createAction(
  '[Test Summary] Weather conditions changed',
  props<{ payload: WeatherConditions[] }>(),
);
