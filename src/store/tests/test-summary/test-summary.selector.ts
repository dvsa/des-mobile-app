import {
  Identification,
  IndependentDriving,
  TestSummary,
  WeatherConditions,
} from '@dvsa/mes-test-schema/categories/common';
import { createSelector } from '@ngrx/store';
import { selectTestSummary } from '@store/tests/test-summary/test-summary.reducer';

export const getRouteNumber = (ts: TestSummary): number => ts.routeNumber;
export const selectRouteNumber = createSelector(
  selectTestSummary,
  ({ routeNumber }) => routeNumber,
);
export const getCandidateDescription = (ts: TestSummary): string => ts.candidateDescription;
export const selectCandidateDescription = createSelector(
  selectTestSummary,
  ({ candidateDescription }) => candidateDescription,
);
export const getAdditionalInformation = (ts: TestSummary): string => ts.additionalInformation;
export const selectAdditionalInformation = createSelector(
  selectTestSummary,
  ({ additionalInformation }) => additionalInformation,
);
export const getD255 = (ts: TestSummary): boolean => ts.D255;
export const selectD255 = createSelector(
  selectTestSummary,
  ({ D255 }) => D255,
);
export const getIdentification = (ts: TestSummary): Identification => ts.identification;
export const selectIdentification = createSelector(
  selectTestSummary,
  ({ identification }) => identification,
);
export const selectTrueLikenessToPhoto = createSelector(
  selectTestSummary,
  ({ trueLikenessToPhoto }) => trueLikenessToPhoto,
);
export const getTrueLikenessToPhoto = (ts: TestSummary): boolean => ts.trueLikenessToPhoto;
export const selectSatNavUsed = createSelector(
  selectTestSummary,
  ({ independentDriving }) => independentDriving === 'Sat nav',
);
export const getSatNavUsed = (ts: TestSummary): boolean => ts.independentDriving === 'Sat nav';
export const selectTrafficSignsUsed = createSelector(
  selectTestSummary,
  ({ independentDriving }) => independentDriving === 'Traffic signs',
);
export const getTrafficSignsUsed = (ts: TestSummary): boolean => ts.independentDriving === 'Traffic signs';
export const selectIsDebriefWitnessed = createSelector(
  selectTestSummary,
  ({ debriefWitnessed }) => debriefWitnessed,
);
export const isDebriefWitnessed = (ts: TestSummary): boolean => ts.debriefWitnessed;
export const selectWeatherConditions = createSelector(
  selectTestSummary,
  ({ weatherConditions }) => weatherConditions,
);
export const getWeatherConditions = (ts: TestSummary): WeatherConditions[] => ts.weatherConditions;
export const selectIndependentDriving = createSelector(
  selectTestSummary,
  ({ independentDriving }) => independentDriving,
);
export const getIndependentDriving = (ts: TestSummary): IndependentDriving => ts.independentDriving;
