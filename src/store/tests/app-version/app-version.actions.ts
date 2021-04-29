import { createAction } from '@ngrx/store';

export const PopulateAppVersion = createAction(
  '[Journal Effects] Populating app version',
  (appVersion: string) => ({ appVersion }),
);
