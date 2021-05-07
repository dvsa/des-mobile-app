import { createAction } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export const StartE2EPracticeTest = createAction(
  '[Tests] Start Full Practice Test',
  (slotId: string, category: TestCategory = TestCategory.B) => ({ slotId, category }),
);

export type Types = typeof StartE2EPracticeTest;
