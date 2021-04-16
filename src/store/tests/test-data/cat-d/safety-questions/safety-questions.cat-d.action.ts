import { createAction } from '@ngrx/store';
import { QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';

export const SAFETY_QUESTION_OUTCOME_CHANGED = '[VehicleChecksPage] [CatD] Safety Question Outcome Changed';
export const ADD_SAFETY_QUESTION_COMMENT = '[Vehicle Checks] [CatD] Add SafetyQuestion comment';

export const SafetyQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatD] Safety Question Outcome Changed',
  (safetyQuestionOutcome: QuestionOutcome, index: number) => ({ safetyQuestionOutcome, index }),
);

export const AddSafetyQuestionComment = createAction(
  '[Vehicle Checks] [CatD] Add SafetyQuestion comment',
  (comment: string) => ({ comment }),
);
