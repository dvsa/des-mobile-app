import { createAction } from '@ngrx/store';

export const SetChangeMarker = createAction(
  '[Test Actions] Set the change marker for the test',
  (changeMarker: boolean) => ({ changeMarker }),
);
