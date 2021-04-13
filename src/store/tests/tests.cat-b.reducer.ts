import { Action, combineReducers } from '@ngrx/store';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { schemaVersionReducer } from './schema-version/schema-version.reducer';
import { categoryReducer } from './category/category.reducer';
import { preTestDeclarationsReducer } from './pre-test-declarations/pre-test-declarations.reducer';
import { accompanimentReducer } from './accompaniment/accompaniment.reducer';
import { vehicleDetailsReducer } from './vehicle-details/cat-b/vehicle-details.cat-b.reducer';
import { passCompletionReducer } from './pass-completion/pass-completion.reducer';
import { postTestDeclarationsReducer } from './post-test-declarations/post-test-declarations.reducer';
import { testSummaryReducer } from './test-summary/test-summary.reducer';
import { communicationPreferencesReducer } from './communication-preferences/communication-preferences.reducer';
import { rekeyReducer } from './rekey/rekey.reducer';
import { rekeyDateReducer } from './rekey-date/rekey-date.reducer';
import { rekeyReasonReducer } from './rekey-reason/rekey-reason.reducer';
import { examinerBookedReducer } from './examiner-booked/examiner-booked.reducer';
import { examinerConductedReducer } from './examiner-conducted/examiner-conducted.reducer';
import { examinerKeyedReducer } from './examiner-keyed/examiner-keyed.reducer';
import { changeMarkerReducer } from './change-marker/change-marker.reducer';
import { activityCodeReducer } from './activity-code/activity-code.reducer';
import { instructorDetailsReducer } from './instructor-details/instructor-details.reducer';
import { testDataReducer } from './test-data/cat-b/test-data.reducer';
import { journalDataReducer } from './journal-data/cat-b/journal-data.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';

export function testsCatBReducer(
  action: Action, state: CatBUniqueTypes.TestResult,
): Required<CatBUniqueTypes.TestResult> {
  return combineReducers(
    {
      version: schemaVersionReducer,
      category: categoryReducer,
      activityCode: activityCodeReducer,
      journalData: journalDataReducer,
      preTestDeclarations: preTestDeclarationsReducer,
      accompaniment: accompanimentReducer,
      vehicleDetails: vehicleDetailsReducer,
      instructorDetails: instructorDetailsReducer,
      testData: testDataReducer,
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
    state as Required<CatBUniqueTypes.TestResult>,
    action,
  );
}
