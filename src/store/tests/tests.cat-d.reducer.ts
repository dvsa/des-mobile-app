import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { Action, combineReducers } from '@ngrx/store';
import { changeMarkerReducer } from '@store/tests/change-marker/change-marker.reducer';
import { journalDataCatDReducer } from '@store/tests/journal-data/cat-d/journal-data.cat-d.reducer';
import { passCompletionCatDReducer } from '@store/tests/pass-completion/cat-d/pass-completion.cat-d.reducer';
import { preTestDeclarationsCatDReducer } from '@store/tests/pre-test-declarations/cat-d/pre-test-declarations.cat-d.reducer';
import { testSummaryReducer } from '@store/tests/test-summary/test-summary.reducer';
import { vehicleDetailsCatDReducer } from '@store/tests/vehicle-details/cat-d/vehicle-details.cat-d.reducer';
import { accompanimentReducer } from './accompaniment/accompaniment.reducer';
import { activityCodeReducer } from './activity-code/activity-code.reducer';
import { appVersionReducer } from './app-version/app-version.reducer';
import { categoryReducer } from './category/category.reducer';
import { communicationPreferencesReducer } from './communication-preferences/communication-preferences.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';
import { examinerBookedReducer } from './examiner-booked/examiner-booked.reducer';
import { examinerConductedReducer } from './examiner-conducted/examiner-conducted.reducer';
import { examinerKeyedReducer } from './examiner-keyed/examiner-keyed.reducer';
import { postTestDeclarationsReducer } from './post-test-declarations/post-test-declarations.reducer';
import { rekeyDateReducer } from './rekey-date/rekey-date.reducer';
import { rekeyReasonReducer } from './rekey-reason/rekey-reason.reducer';
import { rekeyReducer } from './rekey/rekey.reducer';
import { schemaVersionReducer } from './schema-version/schema-version.reducer';
import { testDataCatDReducer } from './test-data/cat-d/test-data.cat-d.reducer';

export function testsCatDReducer(
	action: Action,
	state: CatDUniqueTypes.TestResult
): Required<CatDUniqueTypes.TestResult> {
	return combineReducers({
		appVersion: appVersionReducer,
		version: schemaVersionReducer,
		category: categoryReducer,
		activityCode: activityCodeReducer,
		journalData: journalDataCatDReducer,
		preTestDeclarations: preTestDeclarationsCatDReducer,
		accompaniment: accompanimentReducer,
		vehicleDetails: vehicleDetailsCatDReducer,
		passCompletion: passCompletionCatDReducer,
		testData: testDataCatDReducer,
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
	})(state as Required<CatDUniqueTypes.TestResult>, action);
}
