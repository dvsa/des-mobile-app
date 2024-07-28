import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
import { Action, combineReducers } from '@ngrx/store';
import { appVersionReducer } from '@store/tests/app-version/app-version.reducer';
import { changeMarkerReducer } from '@store/tests/change-marker/change-marker.reducer';
import { passCompletionCatDReducer } from '@store/tests/pass-completion/cat-d/pass-completion.cat-d.reducer';
import { preTestDeclarationsCatDReducer } from '@store/tests/pre-test-declarations/cat-d/pre-test-declarations.cat-d.reducer';
import { testSummaryReducer } from '@store/tests/test-summary/test-summary.reducer';
import { accompanimentReducer } from './accompaniment/accompaniment.reducer';
import { activityCodeReducer } from './activity-code/activity-code.reducer';
import { categoryReducer } from './category/category.reducer';
import { communicationPreferencesReducer } from './communication-preferences/communication-preferences.reducer';
import { delegatedTestReducer } from './delegated-test/delegated-test.reducer';
import { examinerBookedReducer } from './examiner-booked/examiner-booked.reducer';
import { examinerConductedReducer } from './examiner-conducted/examiner-conducted.reducer';
import { examinerKeyedReducer } from './examiner-keyed/examiner-keyed.reducer';
import { journalDataCatDReducer } from './journal-data/cat-d/journal-data.cat-d.reducer';
import { postTestDeclarationsReducer } from './post-test-declarations/post-test-declarations.reducer';
import { rekeyDateReducer } from './rekey-date/rekey-date.reducer';
import { rekeyReasonReducer } from './rekey-reason/rekey-reason.reducer';
import { rekeyReducer } from './rekey/rekey.reducer';
import { schemaVersionReducer } from './schema-version/schema-version.reducer';
import { testDataCatD1EReducer } from './test-data/cat-d/test-data.cat-d1e.reducer';
import { vehicleDetailsCatDReducer } from './vehicle-details/cat-d/vehicle-details.cat-d.reducer';

export function testsCatD1EReducer(
	action: Action,
	state: CatD1EUniqueTypes.TestResult
): Required<CatD1EUniqueTypes.TestResult> {
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
		journalData: journalDataCatDReducer,
		passCompletion: passCompletionCatDReducer,
		preTestDeclarations: preTestDeclarationsCatDReducer,
		postTestDeclarations: postTestDeclarationsReducer,
		rekey: rekeyReducer,
		rekeyDate: rekeyDateReducer,
		rekeyReason: rekeyReasonReducer,
		testData: testDataCatD1EReducer,
		testSummary: testSummaryReducer,
		version: schemaVersionReducer,
		vehicleDetails: vehicleDetailsCatDReducer,
	})(state as Required<CatD1EUniqueTypes.TestResult>, action);
}
