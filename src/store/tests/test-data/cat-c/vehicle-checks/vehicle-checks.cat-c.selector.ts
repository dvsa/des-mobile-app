import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector } from '@ngrx/store';
import { some } from 'lodash';

export type CatCVehicleChecks =
  | CatCUniqueTypes.VehicleChecks
  | CatC1UniqueTypes.VehicleChecks
  | CatCEUniqueTypes.VehicleChecks
  | CatC1EUniqueTypes.VehicleChecks;

export const getSelectedShowMeQuestions = (
  vehicleChecks: CatCVehicleChecks,
): QuestionResult[] => {
  return vehicleChecks.showMeQuestions;
};

export const getSelectedTellMeQuestions = (
  vehicleChecksCatCReducer: CatCVehicleChecks,
): QuestionResult[] => {
  return vehicleChecksCatCReducer.tellMeQuestions;
};

export const getFullLicenceHeld = (
  vehicleChecksCatCReducer: CatCVehicleChecks,
): boolean => (vehicleChecksCatCReducer as CatCUniqueTypes.VehicleChecks).fullLicenceHeld;

export const vehicleChecksExist = (vehicleChecks: CatCVehicleChecks): boolean => {
  const questions = [...vehicleChecks.showMeQuestions, ...vehicleChecks.tellMeQuestions];
  return some(questions, (fault) => fault.outcome != null);
};

export const hasFullLicenceHeldBeenSelected = (
  fullLicenceHeld: boolean,
): string => (fullLicenceHeld === null) ? null : fullLicenceHeld ? 'Y' : 'N';

export const getVehicleChecksCompleted = (vehicleChecks: CatCVehicleChecks) => vehicleChecks.vehicleChecksCompleted;

export const getVehicleChecksCatC = createFeatureSelector<CatCVehicleChecks>('vehicleChecks');
