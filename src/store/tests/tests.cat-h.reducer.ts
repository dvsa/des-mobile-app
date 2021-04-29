import { Action, combineReducers } from '@ngrx/store';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { preTestDeclarationsReducer } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { testSummaryReducer } from '@store/tests/test-summary/test-summary.reducer';
import { changeMarkerReducer } from '@store/tests/change-marker/change-marker.reducer';
import { testDataCatHReducer } from '@store/tests/test-data/cat-home/test-data.cat-h.reducer';
import { vehicleDetailsReducer } from '@store/tests/vehicle-details/vehicle-details.reducer';
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
import { journalDataCatHomeReducer } from './journal-data/cat-home/journal-data.cat-home.reducer';
import { passCompletionReducer } from './pass-completion/pass-completion.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';
import { appVersionReducer } from './app-version/app-version.reducer';

export function testsCatHReducer(
  action: Action,
  state: CatHUniqueTypes.TestResult,
): Required<CatHUniqueTypes.TestResult> {
  return combineReducers(
    {
      appVersion: appVersionReducer,
      version: schemaVersionReducer,
      category: categoryReducer,
      activityCode: activityCodeReducer,
      journalData: journalDataCatHomeReducer,
      preTestDeclarations: preTestDeclarationsReducer,
      accompaniment: accompanimentReducer,
      vehicleDetails: vehicleDetailsReducer,
      testData: testDataCatHReducer,
      passCompletion: passCompletionReducer,
      postTestDeclarations: postTestDeclarationsReducer,
      testSummary: testSummaryReducer,
      communicationPreferences: communicationPreferencesReducer,
      rekey: rekeyReducer,
      rekeyDate: rekeyDateReducer,
      rekeyReason: rekeyReasonReducer,
      delegatedTest: delegatedTestReducer,
      examinerBooked: examinerBookedReducer,
      examinerConducted: examinerConductedReducer,
      examinerKeyed: examinerKeyedReducer,
      changeMarker: changeMarkerReducer,
    },
  )(
    state as Required<CatHUniqueTypes.TestResult>,
    action,
  );
}
