import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import { applicationReferenceReducer } from '../common/application-reference/application-reference.reducer';
import { candidateReducer } from '../common/candidate/candidate.reducer';
import { examinerReducer } from '../common/examiner/examiner.reducer';
import { testCentreReducer } from '../common/test-centre/test-centre.reducer';
import { testSlotsAttributesReducer } from '../common/test-slot-attributes/test-slot-attributes.reducer';

export const initialState: JournalData = {
  applicationReference: {
    applicationId: null,
    bookingSequence: null,
    checkDigit: null,
  },
  candidate: {},
  examiner: {
    staffNumber: null,
  },
  testCentre: {
    centreId: null,
    centreName: null,
    costCode: null,
  },
  testSlotAttributes: {
    entitlementCheck: null,
    examinerVisiting: null,
    extendedTest: null,
    previousCancellation: null,
    slotId: null,
    slotType: null,
    specialNeeds: null,
    specialNeedsArray: null,
    specialNeedsCode: null,
    start: null,
    vehicleTypeCode: null,
    welshTest: null,
  },
};

export function journalDataCatAMod2Reducer(state = initialState, action: Action): Required<JournalData> {
  return combineReducers({
    examiner: examinerReducer,
    testCentre: testCentreReducer,
    testSlotAttributes: testSlotsAttributesReducer,
    candidate: candidateReducer,
    applicationReference: applicationReferenceReducer,
  })(state as Required<JournalData>, action);
}

export const getJournalData = createFeatureSelector<JournalData>('journalData');
