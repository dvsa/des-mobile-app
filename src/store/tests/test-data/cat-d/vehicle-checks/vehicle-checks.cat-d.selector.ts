import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector } from '@ngrx/store';
import { some } from 'lodash-es';

export type CatDVehicleChecks =
	| CatDUniqueTypes.VehicleChecks
	| CatD1UniqueTypes.VehicleChecks
	| CatDEUniqueTypes.VehicleChecks
	| CatD1EUniqueTypes.VehicleChecks;

export const getSelectedShowMeQuestions = (vehicleChecks: CatDVehicleChecks): QuestionResult[] => {
	return vehicleChecks.showMeQuestions;
};

export const getFullLicenceHeld = (vehicleChecksCatDReducer: CatDVehicleChecks): boolean =>
	vehicleChecksCatDReducer.fullLicenceHeld;

export const getSelectedTellMeQuestions = (vehicleChecksCatDReducer: CatDVehicleChecks): QuestionResult[] => {
	return vehicleChecksCatDReducer.tellMeQuestions;
};

export const vehicleChecksExist = (vehicleChecks: CatDVehicleChecks): boolean => {
	const questions = [...vehicleChecks.showMeQuestions, ...vehicleChecks.tellMeQuestions];
	return some(questions, (fault) => fault.outcome != null);
};

export const hasFullLicenceHeldBeenSelected = (fullLicenceHeld: boolean): string =>
	fullLicenceHeld === null ? null : fullLicenceHeld ? 'Y' : 'N';

export const getVehicleChecksCompleted = (vehicleChecks: CatDVehicleChecks) => vehicleChecks.vehicleChecksCompleted;

export const getVehicleChecksCatD = createFeatureSelector<CatDVehicleChecks>('vehicleChecks');
