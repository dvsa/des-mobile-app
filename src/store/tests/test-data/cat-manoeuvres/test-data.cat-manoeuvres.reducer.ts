import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';

import { CatC1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/C1EM';
import { CatC1MUniqueTypes } from '@dvsa/mes-test-schema/categories/C1M';
import { CatCEMUniqueTypes } from '@dvsa/mes-test-schema/categories/CEM';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { CatD1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/D1EM';
import { CatD1MUniqueTypes } from '@dvsa/mes-test-schema/categories/D1M';
import { CatDEMUniqueTypes } from '@dvsa/mes-test-schema/categories/DEM';
import { CatDMUniqueTypes } from '@dvsa/mes-test-schema/categories/DM';
import { emptyObjReducer } from '@shared/classes/null.reducer';
import { manoeuvresCatManoeuvreReducer } from '@store/tests/test-data/cat-manoeuvres/manoeuvres/manoeuvres.cat-cm.reducer';
import { uncoupleRecoupleReducer } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.reducer';
import { dangerousFaultsReducer } from '../common/dangerous-faults/dangerous-faults.reducer';
import { drivingFaultsReducer } from '../common/driving-faults/driving-faults.reducer';
import { ecoReducer } from '../common/eco/eco.reducer';
import { etaReducer } from '../common/eta/eta.reducer';
import { seriousFaultsReducer } from '../common/serious-faults/serious-faults.reducer';

export type TestDataManoeuvresUnion =
	| CatCMUniqueTypes.TestData
	| CatC1MUniqueTypes.TestData
	| CatCEMUniqueTypes.TestData
	| CatC1EMUniqueTypes.TestData
	| CatDMUniqueTypes.TestData
	| CatD1MUniqueTypes.TestData
	| CatDEMUniqueTypes.TestData
	| CatD1EMUniqueTypes.TestData;

export const initialState: TestDataManoeuvresUnion = {
	uncoupleRecouple: {},
	dangerousFaults: {},
	drivingFaults: {},
	manoeuvres: {},
	seriousFaults: {},
	testRequirements: {},
	ETA: {},
	eco: {},
};

export function testDataCatManoeuvresReducer(
	state: TestDataManoeuvresUnion,
	action: Action
): Required<TestDataManoeuvresUnion> {
	return combineReducers({
		drivingFaults: drivingFaultsReducer,
		dangerousFaults: dangerousFaultsReducer,
		seriousFaults: seriousFaultsReducer,
		eco: ecoReducer,
		ETA: etaReducer,
		manoeuvres: manoeuvresCatManoeuvreReducer,
		testRequirements: emptyObjReducer,
		uncoupleRecouple: uncoupleRecoupleReducer,
	})(state as Required<TestDataManoeuvresUnion>, action);
}

export const getTestData = createFeatureSelector<TestDataManoeuvresUnion>('testData');
