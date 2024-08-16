import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import { applicationReferenceReducer } from '../common/application-reference/application-reference.reducer';
import { examinerReducer } from '../common/examiner/examiner.reducer';
import { testCentreReducer } from '../common/test-centre/test-centre.reducer';
import { testSlotsAttributesReducer } from '../common/test-slot-attributes/test-slot-attributes.reducer';
import { candidateCatDReducer } from './candidate/candidate.cat-d.reducer';

export const initialState: CatDUniqueTypes.JournalData = {
  applicationReference: {
    applicationId: null,
    bookingSequence: null,
    checkDigit: null,
  },
  candidate: {},
  examiner: {
    individualId: null,
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

export function journalDataCatDReducer(state = initialState, action: Action): Required<CatDUniqueTypes.JournalData> {
  return combineReducers({
    examiner: examinerReducer,
    testCentre: testCentreReducer,
    testSlotAttributes: testSlotsAttributesReducer,
    candidate: candidateCatDReducer,
    applicationReference: applicationReferenceReducer,
  })(state as Required<CatDUniqueTypes.JournalData>, action);
}

export const getJournalData = createFeatureSelector<CatDUniqueTypes.JournalData>('journalData');
