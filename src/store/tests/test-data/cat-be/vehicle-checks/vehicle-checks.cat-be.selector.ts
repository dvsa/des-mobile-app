import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector } from '@ngrx/store';
import { some } from 'lodash';

export const getSelectedShowMeQuestions = (
  vehicleChecks: CatBEUniqueTypes.VehicleChecks,
): QuestionResult[] => {
  return vehicleChecks.showMeQuestions;
};

export const getSelectedTellMeQuestions = (
  vehicleChecksCatBEReducer: CatBEUniqueTypes.VehicleChecks,
): QuestionResult[] => {
  return vehicleChecksCatBEReducer.tellMeQuestions;
};

export const vehicleChecksExist = (vehicleChecks: CatBEUniqueTypes.VehicleChecks): boolean => {
  const questions = [...vehicleChecks.showMeQuestions, ...vehicleChecks.tellMeQuestions];
  return some(questions, (fault) => fault.outcome != null);
};

export const getVehicleChecksCatBE = createFeatureSelector<CatBEUniqueTypes.VehicleChecks>('vehicleChecks');
