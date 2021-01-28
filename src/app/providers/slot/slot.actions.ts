import { Action } from '@ngrx/store';

export const SLOT_HAS_CHANGED = '[SlotProvider] SLOT_HAS_CHANGED';

export class SlotHasChanged implements Action {
  readonly type = SLOT_HAS_CHANGED;
  constructor(public slotId: number) {
  }
}
export type Types =
  | SlotHasChanged;
