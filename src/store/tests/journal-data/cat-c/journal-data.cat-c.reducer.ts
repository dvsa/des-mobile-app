import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import { applicationReferenceReducer } from '../common/application-reference/application-reference.reducer';
import { examinerReducer } from '../common/examiner/examiner.reducer';
import { testCentreReducer } from '../common/test-centre/test-centre.reducer';
import { testSlotsAttributesReducer } from '../common/test-slot-attributes/test-slot-attributes.reducer';
import { candidateCatCReducer } from './candidate/candidate.cat-c.reducer';

export const initialState: CatCUniqueTypes.JournalData = {
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

export function journalDataCatCReducer(state = initialState, action: Action): Required<CatCUniqueTypes.JournalData> {
  return combineReducers({
    examiner: examinerReducer,
    testCentre: testCentreReducer,
    testSlotAttributes: testSlotsAttributesReducer,
    candidate: candidateCatCReducer,
    applicationReference: applicationReferenceReducer,
  })(state as Required<CatCUniqueTypes.JournalData>, action);
}

export const getJournalData = createFeatureSelector<CatCUniqueTypes.JournalData>('journalData');
