import { createAction, props } from '@ngrx/store';
import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';

export const ShowMeQuestionSelected = createAction(
  '[VehicleChecksPage] [CatADI2] Show Me Question Selected',
  props<{ showMeQuestion: QuestionResult, index: number }>(),
);

export const VehicleChecksCompletedToggle = createAction(
  '[Vehicle Checks] [CatADI2] Vehicle Checks Completed Toggled',
);

export const ShowMeQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatADI2] Show Me Question Outcome Changed',
  props<{ showMeQuestionOutcome: QuestionOutcome, index: number }>(),
);

export const TellMeQuestionSelected = createAction(
  '[VehicleChecksPage] [CatADI2] Tell Me Question Selected',
  props<{ tellMeQuestion: QuestionResult, index: number }>(),
);

export const TellMeQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatADI2] Tell Me Question Outcome Changed',
  props<{ tellMeQuestionOutcome: QuestionOutcome, index: number }>(),
);

export const AddShowMeTellMeComment = createAction(
  '[Vehicle Checks] [CatADI2] Add Show Me / Tell Me comment',
  props<{ payload: string }>(),
);

export const ShowMeQuestionAddDrivingFault = createAction(
  '[Vehicle Checks] [CatADI2] Show Me Question Add Driving Fault',
  props<{ payload: number }>(),
);

export const ShowMeQuestionRemoveDrivingFault = createAction(
  '[Vehicle Checks] [CatADI2] Show Me Question Remove Driving Fault',
  props<{ payload: number }>(),
);

export const VehicleChecksAddSeriousFault = createAction(
  '[Vehicle Checks] [CatADI2] Vehicle Checks Add Serious Fault',
);

export const VehicleChecksAddDangerousFault = createAction(
  '[Vehicle Checks] [CatADI2] Vehicle Checks Add Dangerous Fault',
);

export const VehicleChecksRemoveSeriousFault = createAction(
  '[Vehicle Checks] [CatADI2] Vehicle Checks Remove Serious Fault',
);

export const VehicleChecksRemoveDangerousFault = createAction(
  '[Vehicle Checks] [CatADI2] Vehicle Checks Remove Dangerous Fault',
);
