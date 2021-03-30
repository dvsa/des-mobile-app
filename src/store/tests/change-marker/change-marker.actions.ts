import { createAction, props } from '@ngrx/store';

export const SetChangeMarker = createAction(
  '[Test Actions] Set the change marker for the test',
  props<{ payload: boolean }>(),
);
