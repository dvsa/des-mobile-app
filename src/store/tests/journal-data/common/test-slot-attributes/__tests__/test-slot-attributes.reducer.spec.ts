import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { DateTime } from '@shared/helpers/date-time';
import { testSlotsAttributesReducer } from '../test-slot-attributes.reducer';
import { PopulateTestSlotAttributes, SetStartDate } from '../test-slot-attributes.actions';

const testTime = new DateTime().toString();

describe('testSlotAttributes reducer', () => {
  const mockTestSlotAttributes: TestSlotAttributes = {
    slotId: 1234,
    specialNeeds: true,
    start: testTime,
    vehicleTypeCode: 'C',
    extendedTest: true,
    welshTest: null,
  };

  it('should return the testSlotAttributes for populate test centre actions', () => {
    const result = testSlotsAttributesReducer(null, PopulateTestSlotAttributes(mockTestSlotAttributes));
    expect(result).toBe(mockTestSlotAttributes);
  });

  describe('SET_START_DATE', () => {
    it('should return the testSlotAttributes with new start property', () => {
      mockTestSlotAttributes.start = '2021-01-15T08:10:00.000Z';
      const updatedDate = '2020-12-25T08:10:00.000Z';
      const state = testSlotsAttributesReducer(null, PopulateTestSlotAttributes(mockTestSlotAttributes));

      const result = testSlotsAttributesReducer(state, SetStartDate(updatedDate));

      expect(result.start).toBe(updatedDate);
    });
  });

});
