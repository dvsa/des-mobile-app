import { createAction } from '@ngrx/store';

export const PopulateTestScore = createAction(
  '[CatCPC] Populate total percentage',
  (score: number) => ({ score }),
);
