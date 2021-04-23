import { VehicleChecksUnion } from '@shared/unions/test-schema-unions';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector } from '@ngrx/store';
import { some } from 'lodash';

export const getSelectedShowMeQuestions = (
  vehicleChecks: VehicleChecksUnion,
): QuestionResult[] => {
  return vehicleChecks.showMeQuestions;
};

export const getSelectedTellMeQuestions = (
  vehicleChecks: VehicleChecksUnion,
): QuestionResult[] => {
  return vehicleChecks.tellMeQuestions;
};

export const vehicleChecksExist = (vehicleChecks: VehicleChecksUnion): boolean => {
  const questions = [...vehicleChecks.showMeQuestions, ...vehicleChecks.tellMeQuestions];
  return some(questions, (fault) => fault.outcome != null);
};

export const getVehicleChecksCatHomeTest = createFeatureSelector<VehicleChecksUnion>('vehicleChecks');
