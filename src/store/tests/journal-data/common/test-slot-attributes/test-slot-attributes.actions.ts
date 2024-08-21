import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';

export const PopulateTestSlotAttributes = createAction(
  '[TestSlotAttributesEffects] Populate Test slot attributes',
  (testSlotAttributes: TestSlotAttributes) => ({ testSlotAttributes })
);

export const SetStartDate = createAction('[[Delegated Office Page] Set Start Time', (startDateTime: string) => ({
  startDateTime,
}));

export const SetWelshTestMarker = createAction(
  '[TestSlotAttributes] Manually set welsh test marker',
  (welshTest: boolean) => ({ welshTest })
);
