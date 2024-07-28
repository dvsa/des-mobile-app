import { CombinationCodes } from '@dvsa/mes-test-schema/categories/CPC';
import { createAction } from '@ngrx/store';

export const PopulateCombination = createAction(
	'[WRTC] [CatCPC] Populate Combination',
	(combination: CombinationCodes) => ({ combination })
);
