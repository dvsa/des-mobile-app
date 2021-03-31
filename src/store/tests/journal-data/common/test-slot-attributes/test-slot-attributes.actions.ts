import { createAction, props } from '@ngrx/store';
import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';

export const PopulateTestSlotAttributes = createAction(
  '[TestSlotAttributesEffects] Populate Test slot attributes',
  props<{ payload: TestSlotAttributes }>()
);


export const SetStartDate = createAction(
  '[[Delegated Office Page] Set Start Time',
  props<{ payload: string }>()
);
