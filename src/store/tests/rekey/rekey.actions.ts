import { createAction } from '@ngrx/store';

export const MarkAsRekey = createAction(
  '[Rekey Actions] Mark the test as being rekeyed',
);

export const MarkAsNonRekey = createAction(
  '[Rekey Actions] Mark the test as not being a rekey',
);

export const EndRekey = createAction(
  '[Rekey Actions] End rekey',
);
