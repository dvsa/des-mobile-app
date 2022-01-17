import { TestSummary } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testSummaryActions from './test-summary.actions';

export const initialState: TestSummary = {
  routeNumber: null,
  independentDriving: null,
  candidateDescription: null,
  additionalInformation: null,
  weatherConditions: [],
  debriefWitnessed: null,
  D255: null,
  identification: 'Licence',
  trueLikenessToPhoto: null,
};

export const testSummaryReducer = createReducer(
  initialState,
  on(testSummaryActions.AdditionalInformationChanged, (state, { additionalInformation }): TestSummary => ({
    ...state,
    additionalInformation,
  })),
  on(testSummaryActions.CandidateDescriptionChanged, (state, { candidateDescription }): TestSummary => ({
    ...state,
    candidateDescription,
  })),
  on(testSummaryActions.RouteNumberChanged, (state, { routeNumber }): TestSummary => ({
    ...state,
    routeNumber,
  })),
  on(testSummaryActions.DebriefWitnessed, (state): TestSummary => ({
    ...state,
    debriefWitnessed: true,
  })),
  on(testSummaryActions.DebriefUnWitnessed, (state): TestSummary => ({
    ...state,
    debriefWitnessed: false,
  })),
  on(testSummaryActions.IdentificationUsedChanged, (state, { identification }): TestSummary => ({
    ...state,
    identification,
  })),
  on(testSummaryActions.TrueLikenessToPhotoChanged, (state, { trueLikeness }): TestSummary => ({
    ...state,
    trueLikenessToPhoto: trueLikeness,
  })),
  on(testSummaryActions.IndependentDrivingTypeChanged, (state, { independentDriving }): TestSummary => ({
    ...state,
    independentDriving,
  })),
  on(testSummaryActions.D255Yes, (state): TestSummary => ({
    ...state,
    D255: true,
  })),
  on(testSummaryActions.D255No, (state): TestSummary => ({
    ...state,
    D255: false,
  })),
  on(testSummaryActions.WeatherConditionsChanged, (state, { weatherConditions }): TestSummary => ({
    ...state,
    weatherConditions,
  })),
);

export const getTestSummary = createFeatureSelector<TestSummary>('testSummary');
