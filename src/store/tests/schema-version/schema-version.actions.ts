import { createAction, props } from '@ngrx/store';

export const PopulateTestSchemaVersion = createAction(
  '[Journal Effects] populating test schema version',
  props<{ payload: string }>(),
);
