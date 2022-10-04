import { createAction } from '@ngrx/store';
import { WeatherConditions, Identification, IndependentDriving } from '@dvsa/mes-test-schema/categories/common';
import { FaultSummary } from '@shared/models/fault-marking.model';

export const AdditionalInformationChanged = createAction(
  '[Test Summary] Additional Information changed',
  (additionalInformation: string) => ({ additionalInformation }),
);

export const CandidateDescriptionChanged = createAction(
  '[Test Summary] Candidate description changed',
  (candidateDescription: string) => ({ candidateDescription }),
);

export const RouteNumberChanged = createAction(
  '[Test Summary] Route Number changed',
  (routeNumber: number) => ({ routeNumber }),
);

export const DebriefWitnessed = createAction(
  '[Test Summary] Debrief Witnessed',
);

export const DebriefUnWitnessed = createAction(
  '[Test Summary] Debrief Un-witnessed',
);

export const IdentificationUsedChanged = createAction(
  '[Test Summary] Identification used changed',
  (identification: Identification) => ({ identification }),
);

export const TrueLikenessToPhotoChanged = createAction(
  '[Test Summary] True Likeness to Photo changed',
  (trueLikeness: boolean) => ({ trueLikeness }),
);

export const IndependentDrivingTypeChanged = createAction(
  '[Test Summary] Independent driving changed',
  (independentDriving: IndependentDriving) => ({ independentDriving }),
);

export const D255Yes = createAction(
  '[Test Summary] D255 Yes',
);

export const D255No = createAction(
  '[Test Summary] D255 No',
);

export const WeatherConditionsChanged = createAction(
  '[Test Summary] Weather conditions changed',
  (weatherConditions: WeatherConditions[]) => ({ weatherConditions }),
);

export const EcoFaultChanged = createAction(
  '[Test Summary] Eco related fault(s) changed',
  (faultSummary: FaultSummary[]) => ({ faultSummary }),
);

export const FEDChanged = createAction(
  '[Test Summary] Fuel efficient driving changed',
  (fuelEfficientDriving: boolean) => ({ fuelEfficientDriving }),
);
