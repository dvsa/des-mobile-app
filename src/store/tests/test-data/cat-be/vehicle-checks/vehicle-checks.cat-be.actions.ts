import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';

export const ShowMeQuestionSelected = createAction(
  '[Vehicle Checks] [CatBE] Show Me Question Selected',
  (showMeQuestion: QuestionResult, index: number) => ({ showMeQuestion, index }),
);

export const ShowMeQuestionOutcomeChanged = createAction(
  '[Vehicle Checks] [CatBE] Show Me Question Changed',
  (showMeQuestionOutcome: QuestionOutcome, index: number) => ({ showMeQuestionOutcome, index }),
);

export const TellMeQuestionSelected = createAction(
  '[Vehicle Checks] [CatBE] Tell Me Question Selected',
  (tellMeQuestion: QuestionResult, index: number) => ({ tellMeQuestion, index }),
);

export const TellMeQuestionOutcomeChanged = createAction(
  '[Vehicle Checks] [CatBE] Tell Me Question Outcome Changed',
  (tellMeQuestionOutcome: QuestionOutcome, index: number) => ({ tellMeQuestionOutcome, index }),
);

export const AddShowMeTellMeComment = createAction(
  '[VehicleChecks] [CatBE] Add Show Me Tell Me Comment',
  (comment: string) => ({ comment }),
);

export const VehicleChecksCompletedToggled = createAction(
  '[Vehicle Checks] [CatBE] Vehicle Checks Completed',
  (toggled: boolean) => ({ toggled }),
);

export const VehicleChecksDrivingFaultsNumberChanged = createAction(
  '[Vehicle Checks] [CatBE] Vehicle Checks Driving Faults Number Changed',
  (payload: QuestionResult[]) => ({ payload }),
);
