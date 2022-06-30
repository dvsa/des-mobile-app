import { Action, combineReducers } from '@ngrx/store';
import { TestResultCatADI3Schema } from '@dvsa/mes-test-schema/categories/ADI3';
import { testSummaryADIPart3Reducer } from '@store/tests/test-summary/cat-adi-part3/test-summary.cat-adi-part3.reducer';
import { passCompletionReducer } from '@store/tests/pass-completion/pass-completion.reducer';
import {
  trainerDetailsCatADIPart3Reducer,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.reducer';
import {
  vehicleDetailsCatADIPart3Reducer,
} from '@store/tests/vehicle-details/cat-adi-part3/vehicle-details.cat-adi-part3.reducer';
import { testDataCatADI3Reducer } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { schemaVersionReducer } from './schema-version/schema-version.reducer';
import { categoryReducer } from './category/category.reducer';
import { preTestDeclarationsReducer } from './pre-test-declarations/pre-test-declarations.reducer';
import { accompanimentReducer } from './accompaniment/accompaniment.reducer';
import { postTestDeclarationsReducer } from './post-test-declarations/post-test-declarations.reducer';
import { communicationPreferencesReducer } from './communication-preferences/communication-preferences.reducer';
import { rekeyReducer } from './rekey/rekey.reducer';
import { rekeyDateReducer } from './rekey-date/rekey-date.reducer';
import { rekeyReasonReducer } from './rekey-reason/rekey-reason.reducer';
import { examinerBookedReducer } from './examiner-booked/examiner-booked.reducer';
import { examinerConductedReducer } from './examiner-conducted/examiner-conducted.reducer';
import { examinerKeyedReducer } from './examiner-keyed/examiner-keyed.reducer';
import { changeMarkerReducer } from './change-marker/change-marker.reducer';
import { activityCodeReducer } from './activity-code/activity-code.reducer';
import { journalDataCatADIPart2Reducer } from './journal-data/cat-adi-part2/journal-data.cat-adi-part2.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';
import { appVersionReducer } from './app-version/app-version.reducer';

export function testsCatADIPart3Reducer(
  action: Action,
  state: TestResultCatADI3Schema,
): Required<TestResultCatADI3Schema> {
  return combineReducers(
    {
      accompaniment: accompanimentReducer,
      activityCode: activityCodeReducer,
      appVersion: appVersionReducer,
      category: categoryReducer,
      changeMarker: changeMarkerReducer,
      communicationPreferences: communicationPreferencesReducer,
      delegatedTest: delegatedTestReducer,
      examinerBooked: examinerBookedReducer,
      examinerConducted: examinerConductedReducer,
      examinerKeyed: examinerKeyedReducer,
      journalData: journalDataCatADIPart2Reducer,
      passCompletion: passCompletionReducer,
      postTestDeclarations: postTestDeclarationsReducer,
      preTestDeclarations: preTestDeclarationsReducer,
      rekey: rekeyReducer,
      rekeyDate: rekeyDateReducer,
      rekeyReason: rekeyReasonReducer,
      version: schemaVersionReducer,
      testData: testDataCatADI3Reducer,
      testSummary: testSummaryADIPart3Reducer,
      trainerDetails: trainerDetailsCatADIPart3Reducer,
      vehicleDetails: vehicleDetailsCatADIPart3Reducer,
    },
  )(
    state as Required<TestResultCatADI3Schema>,
    action,
  );
}
