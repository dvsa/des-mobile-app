import { Action, combineReducers } from '@ngrx/store';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { schemaVersionReducer } from './schema-version/schema-version.reducer';
import { categoryReducer } from './category/category.reducer';
import { accompanimentReducer } from './accompaniment/accompaniment.reducer';
import { postTestDeclarationsReducer } from './post-test-declarations/post-test-declarations.reducer';
import { communicationPreferencesReducer } from './communication-preferences/communication-preferences.reducer';
import { rekeyReducer } from './rekey/rekey.reducer';
import { rekeyDateReducer } from './rekey-date/rekey-date.reducer';
import { rekeyReasonReducer } from './rekey-reason/rekey-reason.reducer';
import { examinerBookedReducer } from './examiner-booked/examiner-booked.reducer';
import { examinerConductedReducer } from './examiner-conducted/examiner-conducted.reducer';
import { examinerKeyedReducer } from './examiner-keyed/examiner-keyed.reducer';
import { activityCodeReducer } from './activity-code/activity-code.reducer';
import { journalDataCatCReducer } from './journal-data/cat-c/journal-data.cat-c.reducer';
import { vehicleDetailsCatCReducer } from './vehicle-details/cat-c/vehicle-details.cat-c.reducer';
import { passCompletionCatCReducer } from './pass-completion/cat-c/pass-completion.cat-c.reducer';
import { testDataCatCEReducer } from './test-data/cat-c/test-data.cat-ce.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';
import { preTestDeclarationsReducer } from './pre-test-declarations/pre-test-declarations.reducer';
import { testSummaryReducer } from './test-summary/test-summary.reducer';
import { changeMarkerReducer } from './change-marker/change-marker.reducer';
import { appVersionReducer } from './app-version/app-version.reducer';

export function testsCatCEReducer(
  action: Action,
  state: CatCEUniqueTypes.TestResult,
): Required<CatCEUniqueTypes.TestResult> {
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
      journalData: journalDataCatCReducer,
      passCompletion: passCompletionCatCReducer,
      postTestDeclarations: postTestDeclarationsReducer,
      preTestDeclarations: preTestDeclarationsReducer,
      rekey: rekeyReducer,
      rekeyDate: rekeyDateReducer,
      rekeyReason: rekeyReasonReducer,
      testData: testDataCatCEReducer,
      testSummary: testSummaryReducer,
      vehicleDetails: vehicleDetailsCatCReducer,
      version: schemaVersionReducer,
    },
  )(
    state as Required<CatCEUniqueTypes.TestResult>,
    action,
  );
}
