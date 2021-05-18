import { Action } from '@ngrx/store';

export const REVERSE_LEFT_POPOVER_OPENED = '[Reverse left] Reverse Left Popover Opened';
export const REVERSE_LEFT_POPOVER_CLOSED = '[Reverse left] Reverse Left Popover Closed';

export class ReverseLeftPopoverOpened implements Action {
  readonly type = REVERSE_LEFT_POPOVER_OPENED;
}

export class ReverseLeftPopoverClosed implements Action {
  readonly type = REVERSE_LEFT_POPOVER_CLOSED;
}

export type Types =
  | ReverseLeftPopoverOpened
  | ReverseLeftPopoverClosed;
