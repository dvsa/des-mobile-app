import { createAction } from '@ngrx/store';
import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';

export const PopulateTestSlotAttributes = createAction(
  '[TestSlotAttributesEffects] Populate Test slot attributes',
  (testSlotAttributes: TestSlotAttributes) => ({ testSlotAttributes })
);

export const SetStartDate = createAction(
  '[[Delegated Office Page] Set Start Time',
  (startDateTime: string) => ({ startDateTime }),
);
