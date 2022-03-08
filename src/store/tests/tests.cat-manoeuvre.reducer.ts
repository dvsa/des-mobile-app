import { Action, combineReducers } from '@ngrx/store';
import { changeMarkerReducer } from '@store/tests/change-marker/change-marker.reducer';
import { preTestDeclarationsReducer } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { testSummaryReducer } from '@store/tests/test-summary/test-summary.reducer';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { CatC1MUniqueTypes } from '@dvsa/mes-test-schema/categories/C1M';
import { CatCEMUniqueTypes } from '@dvsa/mes-test-schema/categories/CEM';
import { CatC1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/C1EM';
import { CatDMUniqueTypes } from '@dvsa/mes-test-schema/categories/DM';
import { CatD1MUniqueTypes } from '@dvsa/mes-test-schema/categories/D1M';
import { CatDEMUniqueTypes } from '@dvsa/mes-test-schema/categories/DEM';
import { CatD1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/D1EM';
import { testDataCatManoeuvresReducer } from '@store/tests/test-data/cat-manoeuvres/test-data.cat-manoeuvres.reducer';
import {
  vehicleDetailsCatManoeuvreReducer,
} from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.reducer';
import {
  journalDataCatManoeuvreReducer,
} from '@store/tests/journal-data/cat-manoeuvre/journal-data.cat-manoeuvre.reducer';
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
import { passCompletionReducer } from './pass-completion/pass-completion.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';
import { appVersionReducer } from './app-version/app-version.reducer';

export type TestResultManoeuvresUnion =
    CatCMUniqueTypes.TestResult
    | CatC1MUniqueTypes.TestResult
    | CatCEMUniqueTypes.TestResult
    | CatC1EMUniqueTypes.TestResult
    | CatDMUniqueTypes.TestResult
    | CatD1MUniqueTypes.TestResult
    | CatDEMUniqueTypes.TestResult
    | CatD1EMUniqueTypes.TestResult;

export function testsCatManoeuvreReducer(
  action: Action,
  state: TestResultManoeuvresUnion,
): Required<TestResultManoeuvresUnion> {
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
      journalData: journalDataCatManoeuvreReducer,
      passCompletion: passCompletionReducer,
      postTestDeclarations: postTestDeclarationsReducer,
      preTestDeclarations: preTestDeclarationsReducer,
      rekey: rekeyReducer,
      rekeyDate: rekeyDateReducer,
      rekeyReason: rekeyReasonReducer,
      testData: testDataCatManoeuvresReducer,
      testSummary: testSummaryReducer,
      vehicleDetails: vehicleDetailsCatManoeuvreReducer,
      version: schemaVersionReducer,
    },
  )(
    state as Required<TestResultManoeuvresUnion>,
    action,
  );
}
