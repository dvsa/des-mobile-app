import { createAction } from '@ngrx/store';
import { QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';

export const SafetyQuestionOutcomeChanged = createAction(
  '[VehicleChecksPage] [CatD] Safety Question Outcome Changed',
  (safetyQuestionOutcome: QuestionOutcome, index: number) => ({ safetyQuestionOutcome, index }),
);

export const AddSafetyQuestionComment = createAction(
  '[Vehicle Checks] [CatD] Add SafetyQuestion comment',
  (comment: string) => ({ comment }),
);
