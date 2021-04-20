import { TestSummary } from '@dvsa/mes-test-schema/categories/AM1';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as fromMod1TestSummaryActions from './test-summary.cat-a-mod1.actions';
import * as fromTestSummaryActions from '../test-summary.actions';

export const initialState : TestSummary = {
  routeNumber: 88,
  candidateDescription: null,
  additionalInformation: null,
  weatherConditions: [],
  debriefWitnessed: null,
  D255: null,
  identification: 'Licence',
};

export const testSummaryMod1Reducer = createReducer(
  initialState,
  on(fromTestSummaryActions.AdditionalInformationChanged, (state, { additionalInformation }): TestSummary => ({
    ...state,
    additionalInformation,
  })),
  on(fromTestSummaryActions.CandidateDescriptionChanged, (state, { candidateDescription }): TestSummary => ({
    ...state,
    candidateDescription,
  })),
  on(fromTestSummaryActions.DebriefWitnessed, (state): TestSummary => ({
    ...state,
    debriefWitnessed: true,
  })),
  on(fromTestSummaryActions.DebriefUnWitnessed, (state): TestSummary => ({
    ...state,
    debriefWitnessed: false,
  })),
  on(fromTestSummaryActions.IdentificationUsedChanged, (state, { identification }): TestSummary => ({
    ...state,
    identification,
  })),
  on(fromTestSummaryActions.D255Yes, (state): TestSummary => ({
    ...state,
    D255: true,
  })),
  on(fromTestSummaryActions.D255No, (state): TestSummary => ({
    ...state,
    D255: false,
  })),
  on(fromTestSummaryActions.WeatherConditionsChanged, (state, { weatherConditions }): TestSummary => ({
    ...state,
    weatherConditions,
  })),
  on(fromMod1TestSummaryActions.CircuitTypeChanged, (state, { circuitType }): TestSummary => ({
    ...state,
    circuit: circuitType,
  })),
);

export const getTestSummary = createFeatureSelector<TestSummary>('testSummary');
