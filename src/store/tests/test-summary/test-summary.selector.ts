import {
  TestSummary,
  WeatherConditions,
  Identification,
  IndependentDriving,
} from '@dvsa/mes-test-schema/categories/common';

export const getRouteNumber = (ts: TestSummary): number => ts.routeNumber;
export const getCandidateDescription = (ts: TestSummary): string => ts.candidateDescription;
export const getAdditionalInformation = (ts: TestSummary): string => ts.additionalInformation;
export const getD255 = (ts: TestSummary): boolean => ts.D255;
export const getIdentification = (ts: TestSummary): Identification => ts.identification;
export const getSatNavUsed = (ts: TestSummary): boolean => ts.independentDriving === 'Sat nav';
export const getTrafficSignsUsed = (ts: TestSummary): boolean => ts.independentDriving === 'Traffic signs';
export const isDebriefWitnessed = (ts: TestSummary): boolean => ts.debriefWitnessed;
export const getWeatherConditions = (ts: TestSummary): WeatherConditions[] => ts.weatherConditions;
export const getIndependentDriving = (ts: TestSummary): IndependentDriving => ts.independentDriving;
