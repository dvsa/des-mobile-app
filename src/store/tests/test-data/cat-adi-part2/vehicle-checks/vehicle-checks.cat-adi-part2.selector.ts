import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector } from '@ngrx/store';
import { some } from 'lodash-es';

export const getSelectedShowMeQuestions = (vehicleChecks: CatADI2UniqueTypes.VehicleChecks): QuestionResult[] =>
  vehicleChecks.showMeQuestions;

export const getSelectedTellMeQuestions = (vehicleChecks: CatADI2UniqueTypes.VehicleChecks): QuestionResult[] =>
  vehicleChecks.tellMeQuestions;

export const getVehicleChecksSerious = (vehicleChecks: CatADI2UniqueTypes.VehicleChecks): boolean =>
  vehicleChecks.seriousFault;

export const getVehicleChecksDangerous = (vehicleChecks: CatADI2UniqueTypes.VehicleChecks): boolean =>
  vehicleChecks.dangerousFault;

export const vehicleChecksExist = (vehicleChecks: CatADI2UniqueTypes.VehicleChecks): boolean => {
  return some([...vehicleChecks.tellMeQuestions], (fault) => fault.outcome != null);
};

export const getVehicleChecksCatADI2 = createFeatureSelector<CatADI2UniqueTypes.VehicleChecks>('vehicleChecks');
