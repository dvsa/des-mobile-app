import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { createFeatureSelector, combineReducers, Action } from '@ngrx/store';
import { examinerReducer } from '../common/examiner/examiner.reducer';
import { testCentreReducer } from '../common/test-centre/test-centre.reducer';
import { testSlotsAttributesReducer } from '../common/test-slot-attributes/test-slot-attributes.reducer';
import { applicationReferenceReducer } from '../common/application-reference/application-reference.reducer';
import { candidateCatManoeuvreReducer } from './candidate/candidate.cat-manoeuvre.reducer';

export const initialState: CatCMUniqueTypes.JournalData = {
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

export function journalDataCatManoeuvreReducer(
  state = initialState,
  action: Action,
): Required<CatCMUniqueTypes.JournalData> {
  return combineReducers({
    examiner: examinerReducer,
    testCentre: testCentreReducer,
    testSlotAttributes: testSlotsAttributesReducer,
    candidate: candidateCatManoeuvreReducer,
    applicationReference: applicationReferenceReducer,
  })(state as Required<CatCMUniqueTypes.JournalData>, action);
}

export const getJournalData = createFeatureSelector<CatCMUniqueTypes.JournalData>('journalData');
