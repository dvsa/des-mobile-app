import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testSlotAttributesActions from './test-slot-attributes.actions';

export const initialState: TestSlotAttributes = {
  welshTest: null,
  slotId: null,
  start: '',
  vehicleTypeCode: '',
  extendedTest: false,
  specialNeeds: false,
};

export const testSlotsAttributesReducer = createReducer(
  initialState,
  on(testSlotAttributesActions.PopulateTestSlotAttributes, (_, { payload }): TestSlotAttributes => payload),
  on(testSlotAttributesActions.SetStartDate, (state, { payload }): TestSlotAttributes => ({
    ...state,
    start: payload,
  })),
);

export const getTestSlotAttributes = createFeatureSelector<TestSlotAttributes>('testSlotAttributes');
