import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';

export const ShowMeQuestionSelected = createAction(
  '[VehicleChecksPage] [CatHomeTest] Show Me Question Selected',
  (showMeQuestion: QuestionResult, index: number) => ({ showMeQuestion, index }),
);

export const ShowMeQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatHomeTest] Show Me Question Outcome Changed',
  (showMeQuestionOutcome: QuestionOutcome, index: number) => ({ showMeQuestionOutcome, index }),
);

export const TellMeQuestionSelected = createAction(
  '[VehicleChecksPage] [CatHomeTest] Tell Me Question Selected',
  (tellMeQuestion: QuestionResult, index: number) => ({ tellMeQuestion, index }),
);

export const TellMeQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatHomeTest] Tell Me Question Outcome Changed',
  (tellMeQuestionOutcome: QuestionOutcome, index: number) => ({ tellMeQuestionOutcome, index }),
);

export const AddShowMeTellMeComment = createAction(
  '[VehicleChecksPage] [CatHomeTest] Add Show Me Tell Me Comment',
  (comment: string) => ({ comment }),
);
