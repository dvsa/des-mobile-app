import { createAction, union } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export const START_E2E_PRACTICE_TEST = '[Tests] Start Full Practice Test';

export const StartE2EPracticeTest = createAction(
  START_E2E_PRACTICE_TEST,
  (slotId: string, category: TestCategory) => ({ slotId, category }),
);

const actions = union({
  StartE2EPracticeTest,
});

export type Types = typeof actions;
