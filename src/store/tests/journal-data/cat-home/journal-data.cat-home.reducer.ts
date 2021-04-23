import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { createFeatureSelector, combineReducers, Action } from '@ngrx/store';
import { examinerReducer } from '../common/examiner/examiner.reducer';
import { testCentreReducer } from '../common/test-centre/test-centre.reducer';
import { testSlotsAttributesReducer } from '../common/test-slot-attributes/test-slot-attributes.reducer';
import { candidateCatHomeReducer } from './candidate/candidate.cat-home.reducer';
import { applicationReferenceReducer } from '../common/application-reference/application-reference.reducer';

export const initialState: CatFUniqueTypes.JournalData = {
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

export function journalDataCatHomeReducer(
  state = initialState,
  action: Action,
): Required<CatFUniqueTypes.JournalData> {
  return combineReducers({
    examiner: examinerReducer,
    testCentre: testCentreReducer,
    testSlotAttributes: testSlotsAttributesReducer,
    candidate: candidateCatHomeReducer,
    applicationReference: applicationReferenceReducer,
  })(state as Required<CatFUniqueTypes.JournalData>, action);
}

export const getJournalData = createFeatureSelector<CatFUniqueTypes.JournalData>('journalData');
