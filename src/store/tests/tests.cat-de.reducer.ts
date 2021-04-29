import { Action, combineReducers } from '@ngrx/store';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { preTestDeclarationsReducer } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { passCompletionCatDReducer } from '@store/tests/pass-completion/cad-d/pass-completion.cat-d.reducer';
import { testSummaryReducer } from '@store/tests/test-summary/test-summary.reducer';
import { changeMarkerReducer } from '@store/tests/change-marker/change-marker.reducer';
import { appVersionReducer } from '@store/tests/app-version/app-version.reducer';
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
import { journalDataCatDReducer } from './journal-data/cat-d/journal-data.cat-d.reducer';
import { vehicleDetailsCatDReducer } from './vehicle-details/cat-d/vehicle-details.cat-d.reducer';
import { testDataCatDEReducer } from './test-data/cat-d/test-data.cat-de.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';

export function testsCatDEReducer(
  action: Action,
  state: CatDEUniqueTypes.TestResult,
): Required<CatDEUniqueTypes.TestResult> {
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
      journalData: journalDataCatDReducer,
      passCompletion: passCompletionCatDReducer,
      postTestDeclarations: postTestDeclarationsReducer,
      preTestDeclarations: preTestDeclarationsReducer,
      rekey: rekeyReducer,
      rekeyDate: rekeyDateReducer,
      rekeyReason: rekeyReasonReducer,
      testData: testDataCatDEReducer,
      testSummary: testSummaryReducer,
      version: schemaVersionReducer,
      vehicleDetails: vehicleDetailsCatDReducer,
    },
  )(
    state as Required<CatDEUniqueTypes.TestResult>,
    action,
  );
}
