import { createAction } from '@ngrx/store';
import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export const InitializeVehicleChecks = createAction(
  '[VehicleChecksPage] [CatD] Initialize Vehicle Checks',
  (category: TestCategory) => ({ category }),
);

export const ShowMeQuestionSelected = createAction(
  '[VehicleChecksPage] [CatD] Show Me Question Selected',
  (showMeQuestion: QuestionResult, index: number) => ({ showMeQuestion, index }),
);

export const ShowMeQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatD] Show Me Question Outcome Changed',
  (showMeQuestionOutcome: QuestionOutcome, index: number) => ({ showMeQuestionOutcome, index }),
);

export const TellMeQuestionSelected = createAction(
  '[VehicleChecksPage] [CatD] Tell Me Question Selected',
  (tellMeQuestion: QuestionResult, index: number) => ({ tellMeQuestion, index }),
);

export const TellMeQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatD] Tell Me Question Outcome Changed',
  (tellMeQuestionOutcome: QuestionOutcome, index: number) => ({ tellMeQuestionOutcome, index }),
);

export const AddShowMeTellMeComment = createAction(
  '[Vehicle Checks] [CatD] Add Show me Tell me comment',
  (comment: string) => ({ comment }),
);

export const VehicleChecksCompletedToggled = createAction(
  '[Vehicle Checks] [CatD] Vehicle Checks Completed',
  (toggled: boolean) => ({ toggled }),
);

export const VehicleChecksDrivingFaultsNumberChanged = createAction(
  '[Vehicle Checks] [CatD] Vehicle Checks Driving Faults Number Changed',
  (payload: QuestionResult[]) => ({ payload }),
);
