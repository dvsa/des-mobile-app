import { createAction } from '@ngrx/store';
import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export const InitialiseVehicleChecks = createAction(
  '[VehicleChecksPage] [CatC] Initialise Vehicle Checks',
  (category: TestCategory) => ({ category }),
);

export const ShowMeQuestionSelected = createAction(
  '[VehicleChecksPage] [CatC] Show Me Question Selected',
  (showMeQuestion: QuestionResult, index: number) => ({ showMeQuestion, index }),
);

export const ShowMeQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatC] Show Me Question Outcome Changed',
  (showMeQuestionOutcome: QuestionOutcome, index: number) => ({ showMeQuestionOutcome, index }),
);

export const TellMeQuestionSelected = createAction(
  '[VehicleChecksPage] [CatC] Tell Me Question Selected',
  (tellMeQuestion: QuestionResult, index: number) => ({ tellMeQuestion, index }),
);

export const TellMeQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatC] Tell Me Question Outcome Changed',
  (tellMeQuestionOutcome: QuestionOutcome, index: number) => ({ tellMeQuestionOutcome, index }),
);

export const AddShowMeTellMeComment = createAction(
  '[Vehicle Checks] [CatC] Add Show me Tell me comment',
  (comment: string) => ({ comment }),
);

export const VehicleChecksCompletedToggled = createAction(
  '[Vehicle Checks] [CatC] Vehicle Checks Completed',
  (toggled: boolean) => ({ toggled }),
);

export const VehicleChecksDrivingFaultsNumberChanged = createAction(
  '[Vehicle Checks] [CatC] Vehicle Checks Driving Faults Number Changed',
  (payload: QuestionResult[]) => ({ payload }),
);

export const DropExtraVehicleChecks = createAction(
  '[Vehicle Checks] [CatC] Vehicle Checks dropping extra vehicle checks as full licence held',
);

export const SetFullLicenceHeld = createAction(
  '[Vehicle Checks] [CatC] Full Licence Held toggled',
  (fullLicenceHeld: boolean) => ({ fullLicenceHeld }),
);
