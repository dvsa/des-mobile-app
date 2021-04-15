import { createAction } from '@ngrx/store';
import { CombinationCodes } from '@dvsa/mes-test-schema/categories/CPC';

export const PopulateCombination = createAction(
  '[WRTC] [CatCPC] Populate Combination',
  (combination: CombinationCodes) => ({ combination }),
);
