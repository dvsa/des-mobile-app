import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { selectJournalData } from '@store/tests/tests.selector';
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
  on(testSlotAttributesActions.PopulateTestSlotAttributes, (_, { testSlotAttributes }) => testSlotAttributes),
  on(testSlotAttributesActions.SetStartDate, (state, { startDateTime }): TestSlotAttributes => ({
    ...state,
    start: startDateTime,
  })),
  on(testSlotAttributesActions.SetWelshTestMarker, (state, { welshTest }): TestSlotAttributes => ({
    ...state,
    welshTest,
  })),
);

export const getTestSlotAttributes = createFeatureSelector<TestSlotAttributes>('testSlotAttributes');

export const selectTestSlotAttributes = createSelector(
  selectJournalData,
  (tests) => tests.testSlotAttributes,
);
