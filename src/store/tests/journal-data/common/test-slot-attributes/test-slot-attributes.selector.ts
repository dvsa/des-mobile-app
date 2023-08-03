import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { TestSlot } from '@dvsa/mes-journal-schema';
import * as moment from 'moment';
import { getSlotType } from '@shared/helpers/get-slot-type';
import { createSelector } from '@ngrx/store';
import {
  selectTestSlotAttributes,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';

export const selectTestTime = createSelector(
  selectTestSlotAttributes,
  (testSlotAttributes) => moment(testSlotAttributes.start)
    .format('HH:mm'),
);

export const selectTestDate = createSelector(
  selectTestSlotAttributes,
  (testSlotAttributes) => moment(testSlotAttributes.start)
    .format('DD/MM/YYYY'),
);

export const selectTestStartDateTime = createSelector(
  selectTestSlotAttributes,
  (testSlotAttributes) => testSlotAttributes.start,
);

export const selectIsExtendedTest = createSelector(
  selectTestSlotAttributes,
  (testSlotAttributes) => testSlotAttributes.extendedTest || false,
);

export const selectIsSpecialNeeds = createSelector(
  selectTestSlotAttributes,
  (testSlotAttributes) => testSlotAttributes.specialNeeds || false,
);

export const selectSlotId = createSelector(
  selectTestSlotAttributes,
  (testSlotAttributes) => testSlotAttributes.slotId,
);

export const selectIsWelshTest = createSelector(
  selectTestSlotAttributes,
  (testSlotAttributes) => testSlotAttributes.welshTest,
);

export const selectFitMarker = createSelector(
  selectTestSlotAttributes,
  (testSlotAttributes) => testSlotAttributes.fitMarker,
);

export const getTestTime = (attributes: TestSlotAttributes) => moment(attributes.start)
  .format('HH:mm');
export const getTestDate = (attributes: TestSlotAttributes): string => moment(attributes.start)
  .format('DD/MM/YYYY');

export const getTestStartDateTime = (attributes: TestSlotAttributes): string => attributes.start;
export const isExtendedTest = (attributes: TestSlotAttributes) => attributes.extendedTest || false;
export const isSpecialNeeds = (attributes: TestSlotAttributes) => attributes.specialNeeds || false;
export const getSlotId = (attributes: TestSlotAttributes) => attributes.slotId;
export const isWelshTest = (attributes: TestSlotAttributes) => attributes.welshTest;
export const getFitMarker = (attributes: TestSlotAttributes) => attributes.fitMarker;

export const extractTestSlotAttributes = (slotData: TestSlot): TestSlotAttributes => ({
  welshTest: slotData?.booking?.application?.welshTest || false,
  slotId: slotData?.slotDetail?.slotId,
  start: slotData?.slotDetail?.start,
  specialNeeds: !!slotData?.booking?.application?.specialNeeds,
  specialNeedsCode: slotData?.booking?.application?.specialNeedsCode,
  specialNeedsArray: slotData?.booking?.application?.specialNeeds?.split(';') ?? ['None'],
  vehicleTypeCode: slotData?.vehicleTypeCode,
  extendedTest: slotData?.booking?.application?.extendedTest || false,
  examinerVisiting: slotData?.examinerVisiting,
  previousCancellation: slotData?.booking?.previousCancellation,
  entitlementCheck: slotData?.booking?.application?.entitlementCheck,
  categoryEntitlementCheck: slotData?.booking?.application?.categoryEntitlementCheck || false,
  fitMarker: slotData?.booking?.application?.fitMarker || false,
  fitCaseNumber: slotData?.booking?.application?.fitCaseNumber,
  slotType: getSlotType(slotData),
});
