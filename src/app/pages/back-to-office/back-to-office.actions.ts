import { createAction } from '@ngrx/store';

export const BackToOfficeViewDidEnter = createAction(
  '[BackToOfficePage] ID entered',
  (payload: string) => ({ payload }),
);

export const DeferWriteUp = createAction(
  '[BackToOfficePage] ID entered',
  (payload: string) => ({ payload }),
);
