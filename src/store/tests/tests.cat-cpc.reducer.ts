import { Action, combineReducers } from '@ngrx/store';
import { TestResultCatCPCSchema } from '@dvsa/mes-test-schema/categories/CPC';

import { changeMarkerReducer } from './change-marker/change-marker.reducer';
import { schemaVersionReducer } from './schema-version/schema-version.reducer';
import { categoryReducer } from './category/category.reducer';
import { preTestDeclarationsReducer } from './pre-test-declarations/pre-test-declarations.reducer';
import { postTestDeclarationsReducer } from './post-test-declarations/post-test-declarations.reducer';
import { communicationPreferencesReducer } from './communication-preferences/communication-preferences.reducer';
import { rekeyReducer } from './rekey/rekey.reducer';
import { rekeyDateReducer } from './rekey-date/rekey-date.reducer';
import { rekeyReasonReducer } from './rekey-reason/rekey-reason.reducer';
import { examinerBookedReducer } from './examiner-booked/examiner-booked.reducer';
import { examinerConductedReducer } from './examiner-conducted/examiner-conducted.reducer';
import { examinerKeyedReducer } from './examiner-keyed/examiner-keyed.reducer';
import { activityCodeReducer } from './activity-code/activity-code.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';
import { journalDataCatCPCReducer } from './journal-data/cat-cpc/journal-data.cat-cpc.reducer';
import { testDataCatCPCReducer } from './test-data/cat-cpc/test-data.cat-cpc.reducer';
import { accompanimentCatCPCReducer } from './accompaniment/cat-cpc/accompaniment.cat-cpc.reducer';
import { vehicleDetailsCatCPCReducer } from './vehicle-details/cat-cpc/vehicle-details.cat-cpc.reducer';
import { passCompletionCatCPCReducer } from './pass-completion/cat-cpc/pass-completion.cat-cpc.reducer';
import { testSummaryCPCReducer } from './test-summary/cat-cpc/test-summary.cat-cpc.reducer';

export function testsCatCPCReducer(
  action: Action,
  state: TestResultCatCPCSchema,
): Required<TestResultCatCPCSchema> {
  return combineReducers(
    {
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
    },
  )(
    state as Required<TestResultCatCPCSchema>,
    action,
  );
}
