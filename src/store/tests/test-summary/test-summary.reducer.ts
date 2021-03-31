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
};

export const testSummaryReducer = createReducer(
  initialState,
  on(testSummaryActions.AdditionalInformationChanged, (state, { payload }): TestSummary => ({
    ...state,
    additionalInformation: payload,
  })),
  on(testSummaryActions.CandidateDescriptionChanged, (state, { payload }): TestSummary => ({
    ...state,
    candidateDescription: payload,
  })),
  on(testSummaryActions.RouteNumberChanged, (state, { payload }): TestSummary => ({
    ...state,
    routeNumber: payload,
  })),
  on(testSummaryActions.DebriefWitnessed, (state): TestSummary => ({
    ...state,
    debriefWitnessed: true,
  })),
  on(testSummaryActions.DebriefUnWitnessed, (state): TestSummary => ({
    ...state,
    debriefWitnessed: false,
  })),
  on(testSummaryActions.IdentificationUsedChanged, (state, { payload }): TestSummary => ({
    ...state,
    identification: payload,
  })),
  on(testSummaryActions.IndependentDrivingTypeChanged, (state, { payload }): TestSummary => ({
    ...state,
    independentDriving: payload,
  })),
  on(testSummaryActions.D255Yes, (state): TestSummary => ({
    ...state,
    D255: true,
  })),
  on(testSummaryActions.D255No, (state): TestSummary => ({
    ...state,
    D255: false,
  })),
  on(testSummaryActions.WeatherConditionsChanged, (state, { payload }): TestSummary => ({
    ...state,
    weatherConditions: payload,
  })),
);

export const getTestSummary = createFeatureSelector<TestSummary>('testSummary');
