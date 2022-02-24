import { Action, combineReducers } from '@ngrx/store';
import { TestResultCatAM2Schema } from '@dvsa/mes-test-schema/categories/AM2';
import { changeMarkerReducer } from '@store/tests/change-marker/change-marker.reducer';

import { appVersionReducer } from '@store/tests/app-version/app-version.reducer';
import { schemaVersionReducer } from './schema-version/schema-version.reducer';
import { categoryReducer } from './category/category.reducer';
import { passCompletionCatAMod2Reducer } from './pass-completion/cat-a-mod2/pass-completion.cat-a-mod2.reducer';
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
import { journalDataCatAMod2Reducer } from './journal-data/cat-a-mod2/journal-data.cat-a-mod2.reducer';
import { testDataCatAMod2Reducer } from './test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import { vehicleDetailsCatAMod2Reducer } from './vehicle-details/cat-a-mod2/vehicle-details.cat-a-mod2.reducer';
import { testSummaryMod2Reducer } from './test-summary/cat-a-mod2/test-summary.cat-a-mod2.reducer';
import {
  preTestDeclarationsCatAMod2Reducer,
} from './pre-test-declarations/cat-a-mod2/pre-test-declarations.cat-a-mod2.reducer';

export function testsCatAMod2Reducer(
  action: Action,
  state: TestResultCatAM2Schema,
): Required<TestResultCatAM2Schema> {
  return combineReducers(
    {
      activityCode: activityCodeReducer,
      accompaniment: accompanimentReducer,
      appVersion: appVersionReducer,
      category: categoryReducer,
      changeMarker: changeMarkerReducer,
      communicationPreferences: communicationPreferencesReducer,
      examinerBooked: examinerBookedReducer,
      examinerConducted: examinerConductedReducer,
      examinerKeyed: examinerKeyedReducer,
      journalData: journalDataCatAMod2Reducer,
      passCompletion: passCompletionCatAMod2Reducer,
      postTestDeclarations: postTestDeclarationsReducer,
      preTestDeclarations: preTestDeclarationsCatAMod2Reducer,
      rekey: rekeyReducer,
      rekeyDate: rekeyDateReducer,
      rekeyReason: rekeyReasonReducer,
      testData: testDataCatAMod2Reducer,
      testSummary: testSummaryMod2Reducer,
      version: schemaVersionReducer,
      vehicleDetails: vehicleDetailsCatAMod2Reducer,
    },
  )(
    state as Required<TestResultCatAM2Schema>,
    action,
  );
}
