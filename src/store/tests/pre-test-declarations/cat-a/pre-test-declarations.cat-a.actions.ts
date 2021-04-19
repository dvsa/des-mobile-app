import { createAction } from '@ngrx/store';

export const CbtNumberChanged = createAction(
  '[PreTestDeclarations] [CatA] CBT Number Changed',
  (cbtNumber: string) => ({ cbtNumber }),
);
