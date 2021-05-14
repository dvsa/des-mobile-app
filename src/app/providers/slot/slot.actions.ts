import { createAction } from '@ngrx/store';

export const SLOT_HAS_CHANGED = '[SlotProvider] SLOT_HAS_CHANGED';

export const SlotHasChanged = createAction(
  SLOT_HAS_CHANGED,
  (slotId: number) => ({ slotId }),
);

export type Types =
  | typeof SlotHasChanged;
