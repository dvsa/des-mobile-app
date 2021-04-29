import { Action, combineReducers } from '@ngrx/store';
import { TestResultCatAM1Schema } from '@dvsa/mes-test-schema/categories/AM1';
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
import { changeMarkerReducer } from './change-marker/change-marker.reducer';
import { activityCodeReducer } from './activity-code/activity-code.reducer';
import { journalDataCatAMod1Reducer } from './journal-data/cat-a-mod1/journal-data.cat-a-mod1.reducer';
import { testDataCatAMod1Reducer } from './test-data/cat-a-mod1/test-data.cat-a-mod1.reducer';
import { vehicleDetailsCatAMod1Reducer } from './vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.reducer';
import {
  preTestDeclarationsCatAMod1Reducer,
} from './pre-test-declarations/cat-a-mod1/pre-test-declarations.cat-a-mod1.reducer';
import { passCompletionCatAMod1Reducer } from './pass-completion/cat-a-mod1/pass-completion.cat-a-mod1.reducer';
import { testSummaryMod1Reducer } from './test-summary/cat-a-mod1/test-summary.cat-a-mod1.reducer';
import { appVersionReducer } from './app-version/app-version.reducer';

export function testsCatAMod1Reducer(
  action: Action, state: TestResultCatAM1Schema,
): Required<TestResultCatAM1Schema> {
  return combineReducers(
    {
      appVersion: appVersionReducer,
      version: schemaVersionReducer,
      category: categoryReducer,
      activityCode: activityCodeReducer,
      journalData: journalDataCatAMod1Reducer,
      preTestDeclarations: preTestDeclarationsCatAMod1Reducer,
      accompaniment: accompanimentReducer,
      vehicleDetails: vehicleDetailsCatAMod1Reducer,
      testData: testDataCatAMod1Reducer,
      passCompletion: passCompletionCatAMod1Reducer,
      postTestDeclarations: postTestDeclarationsReducer,
      testSummary: testSummaryMod1Reducer,
      communicationPreferences: communicationPreferencesReducer,
      rekey: rekeyReducer,
      rekeyDate: rekeyDateReducer,
      rekeyReason: rekeyReasonReducer,
      examinerBooked: examinerBookedReducer,
      examinerConducted: examinerConductedReducer,
      examinerKeyed: examinerKeyedReducer,
      changeMarker: changeMarkerReducer,
    },
  )(
    state as Required<TestResultCatAM1Schema>,
    action,
  );
}
