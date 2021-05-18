import { createAction, union } from '@ngrx/store';

export const ReverseDiagramViewDidEnter = createAction(
  '[ReverseDiagramPage] Reverse Diagram Did Enter',
);

export const ReverseDiagramOpened = createAction(
  '[ReverseDiagramPage] Reverse Diagram Opened',
);

export const ReverseDiagramClosed = createAction(
  '[ReverseDiagramPage] Reverse Diagram Closed',
);

export const ReverseDiagramLengthChanged = createAction(
  '[ReverseDiagramPage] Change Vehicle Length',
  (previousLength: number, newLength: number) => ({ previousLength, newLength }),
);

export const ReverseDiagramWidthChanged = createAction(
  '[ReverseDiagramPage] Change Vehicle Width',
  (previousWidth: number, newWidth: number) => ({ previousWidth, newWidth }),
);

const actions = union({
  ReverseDiagramViewDidEnter,
  ReverseDiagramOpened,
  ReverseDiagramClosed,
  ReverseDiagramLengthChanged,
  ReverseDiagramWidthChanged,
});

export type ReverseDiagramTypes = typeof actions;
