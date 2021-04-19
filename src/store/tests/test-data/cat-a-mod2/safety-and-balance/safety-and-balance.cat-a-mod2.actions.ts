import { createAction } from '@ngrx/store';
import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';

export const SafetyQuestionSelected = createAction(
  '[VehicleChecksPage] [CatAMod2] Safety Question Selected',
  (safetyQuestion: QuestionResult, index: number) => ({ safetyQuestion, index }),
);

export const SafetyQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatAMod2] Safety Question Outcome Changed',
  (safetyQuestionOutcome: QuestionOutcome, index: number) => ({ safetyQuestionOutcome, index }),
);

export const BalanceQuestionSelected = createAction(
  '[VehicleChecksPage] [CatAMod2] Balance Question Selected',
  (balanceQuestion: QuestionResult, index: number) => ({ balanceQuestion, index }),
);

export const BalanceQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatAMod2] Balance Question Outcome Changed',
  (balanceQuestionOutcome: QuestionOutcome, index: number) => ({ balanceQuestionOutcome, index }),
);

export const AddSafetyAndBalanceComment = createAction(
  '[Vehicle Checks] [CatAMod2] Add Safety and Balance comment',
  (comment: string) => ({ comment }),
);
