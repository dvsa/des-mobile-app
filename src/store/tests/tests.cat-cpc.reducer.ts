import { TestResultCatCPCSchema } from '@dvsa/mes-test-schema/categories/CPC';
import { Action, combineReducers } from '@ngrx/store';

import { accompanimentCatCPCReducer } from './accompaniment/cat-cpc/accompaniment.cat-cpc.reducer';
import { activityCodeReducer } from './activity-code/activity-code.reducer';
import { appVersionReducer } from './app-version/app-version.reducer';
import { categoryReducer } from './category/category.reducer';
import { changeMarkerReducer } from './change-marker/change-marker.reducer';
import { communicationPreferencesReducer } from './communication-preferences/communication-preferences.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';
import { examinerBookedReducer } from './examiner-booked/examiner-booked.reducer';
import { examinerConductedReducer } from './examiner-conducted/examiner-conducted.reducer';
import { examinerKeyedReducer } from './examiner-keyed/examiner-keyed.reducer';
import { journalDataCatCPCReducer } from './journal-data/cat-cpc/journal-data.cat-cpc.reducer';
import { passCompletionCatCPCReducer } from './pass-completion/cat-cpc/pass-completion.cat-cpc.reducer';
import { postTestDeclarationsReducer } from './post-test-declarations/post-test-declarations.reducer';
import { preTestDeclarationsReducer } from './pre-test-declarations/pre-test-declarations.reducer';
import { rekeyDateReducer } from './rekey-date/rekey-date.reducer';
import { rekeyReasonReducer } from './rekey-reason/rekey-reason.reducer';
import { rekeyReducer } from './rekey/rekey.reducer';
import { schemaVersionReducer } from './schema-version/schema-version.reducer';
import { testDataCatCPCReducer } from './test-data/cat-cpc/test-data.cat-cpc.reducer';
import { testSummaryCPCReducer } from './test-summary/cat-cpc/test-summary.cat-cpc.reducer';
import { vehicleDetailsCatCPCReducer } from './vehicle-details/cat-cpc/vehicle-details.cat-cpc.reducer';

export function testsCatCPCReducer(action: Action, state: TestResultCatCPCSchema): Required<TestResultCatCPCSchema> {
  return combineReducers({
    appVersion: appVersionReducer,
    accompaniment: accompanimentCatCPCReducer,
    activityCode: activityCodeReducer,
    category: categoryReducer,
    changeMarker: changeMarkerReducer,
    communicationPreferences: communicationPreferencesReducer,
    delegatedTest: delegatedTestReducer,
    examinerBooked: examinerBookedReducer,
    examinerConducted: examinerConductedReducer,
    examinerKeyed: examinerKeyedReducer,
    journalData: journalDataCatCPCReducer,
    passCompletion: passCompletionCatCPCReducer,
    preTestDeclarations: preTestDeclarationsReducer,
    postTestDeclarations: postTestDeclarationsReducer,
    rekey: rekeyReducer,
    rekeyDate: rekeyDateReducer,
    rekeyReason: rekeyReasonReducer,
    testSummary: testSummaryCPCReducer,
    testData: testDataCatCPCReducer,
    vehicleDetails: vehicleDetailsCatCPCReducer,
    version: schemaVersionReducer,
  })(state as Required<TestResultCatCPCSchema>, action);
}
