import { createAction } from '@ngrx/store';

export const PopulateTestSchemaVersion = createAction(
  '[Journal Effects] populating test schema version',
  (version: string) => ({ version }),
);
