import { createAction } from '@ngrx/store';
import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';

export const ShowMeQuestionSelected = createAction(
  '[VehicleChecksPage] [CatADI2] Show Me Question Selected',
  (showMeQuestion: QuestionResult, index: number) => ({ showMeQuestion, index }),
);

export const VehicleChecksCompletedToggle = createAction(
  '[Vehicle Checks] [CatADI2] Vehicle Checks Completed Toggled',
);

export const TellMeQuestionSelected = createAction(
  '[VehicleChecksPage] [CatADI2] Tell Me Question Selected',
  (tellMeQuestion: QuestionResult, index: number) => ({ tellMeQuestion, index }),
);

export const TellMeQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatADI2] Tell Me Question Outcome Changed',
  (tellMeQuestionOutcome: QuestionOutcome, index: number) => ({ tellMeQuestionOutcome, index }),
);

export const AddShowMeTellMeComment = createAction(
  '[Vehicle Checks] [CatADI2] Add Show Me / Tell Me comment',
  (payload: string) => ({ payload }),
);

export const ShowMeQuestionAddDrivingFault = createAction(
  '[Vehicle Checks] [CatADI2] Show Me Question Add Driving Fault',
  (payload: number) => ({ payload }),
);

export const ShowMeQuestionRemoveDrivingFault = createAction(
  '[Vehicle Checks] [CatADI2] Show Me Question Remove Driving Fault',
  (payload: number) => ({ payload }),
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
