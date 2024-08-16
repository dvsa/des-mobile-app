import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { Action, combineReducers } from '@ngrx/store';
import { accompanimentReducer } from './accompaniment/accompaniment.reducer';
import { activityCodeReducer } from './activity-code/activity-code.reducer';
import { appVersionReducer } from './app-version/app-version.reducer';
import { categoryReducer } from './category/category.reducer';
import { changeMarkerReducer } from './change-marker/change-marker.reducer';
import { communicationPreferencesReducer } from './communication-preferences/communication-preferences.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';
import { examinerBookedReducer } from './examiner-booked/examiner-booked.reducer';
import { examinerConductedReducer } from './examiner-conducted/examiner-conducted.reducer';
import { examinerKeyedReducer } from './examiner-keyed/examiner-keyed.reducer';
import { journalDataCatCReducer } from './journal-data/cat-c/journal-data.cat-c.reducer';
import { passCompletionCatCReducer } from './pass-completion/cat-c/pass-completion.cat-c.reducer';
import { postTestDeclarationsReducer } from './post-test-declarations/post-test-declarations.reducer';
import { preTestDeclarationsCatCReducer } from './pre-test-declarations/cat-c/pre-test-declarations.cat-c.reducer';
import { rekeyDateReducer } from './rekey-date/rekey-date.reducer';
import { rekeyReasonReducer } from './rekey-reason/rekey-reason.reducer';
import { rekeyReducer } from './rekey/rekey.reducer';
import { schemaVersionReducer } from './schema-version/schema-version.reducer';
import { testDataCatCEReducer } from './test-data/cat-c/test-data.cat-ce.reducer';
import { testSummaryReducer } from './test-summary/test-summary.reducer';
import { vehicleDetailsCatCReducer } from './vehicle-details/cat-c/vehicle-details.cat-c.reducer';

export function testsCatCEReducer(
  action: Action,
  state: CatCEUniqueTypes.TestResult
): Required<CatCEUniqueTypes.TestResult> {
  return combineReducers({
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
    preTestDeclarations: preTestDeclarationsCatCReducer,
    rekey: rekeyReducer,
    rekeyDate: rekeyDateReducer,
    rekeyReason: rekeyReasonReducer,
    testData: testDataCatCEReducer,
    testSummary: testSummaryReducer,
    vehicleDetails: vehicleDetailsCatCReducer,
    version: schemaVersionReducer,
  })(state as Required<CatCEUniqueTypes.TestResult>, action);
}
