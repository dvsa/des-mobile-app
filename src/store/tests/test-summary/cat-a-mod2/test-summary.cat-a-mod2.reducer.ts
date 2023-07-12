import { TestSummary } from '@dvsa/mes-test-schema/categories/AM2';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as fromMod2fromTestSummaryActions from './test-summary.cat-a-mod2.actions';
import * as fromTestSummaryActions from '../test-summary.actions';

export const initialState: TestSummary = {
  routeNumber: null,
  modeOfTransport: null,
  independentDriving: null,
  candidateDescription: null,
  additionalInformation: null,
  weatherConditions: [],
  debriefWitnessed: null,
  D255: null,
  identification: 'Licence',
  trueLikenessToPhoto: null,
};

export const testSummaryMod2Reducer = createReducer(
  initialState,
  on(testSummaryActions.TrueLikenessToPhotoChanged, (state, { trueLikeness }): TestSummary => ({
    ...state,
    trueLikenessToPhoto: trueLikeness,
  })),
  on(fromTestSummaryActions.AdditionalInformationChanged, (state, {
    additionalInformation,
  }): TestSummary => ({
    ...state,
    additionalInformation,
  })),
  on(fromTestSummaryActions.CandidateDescriptionChanged, (state, {
    candidateDescription,
  }): TestSummary => ({
    ...state,
    candidateDescription,
  })),
  on(fromTestSummaryActions.RouteNumberChanged, (state, {
    routeNumber,
  }): TestSummary => ({
    ...state,
    routeNumber: (routeNumber as 88), // Only route number 88 applicable for MOD2
  })),
  on(fromTestSummaryActions.DebriefWitnessed, (state): TestSummary => ({
    ...state,
    debriefWitnessed: true,
  })),
  on(fromTestSummaryActions.DebriefUnWitnessed, (state): TestSummary => ({
    ...state,
    debriefWitnessed: false,
  })),
  on(fromTestSummaryActions.IdentificationUsedChanged, (state, {
    identification,
  }): TestSummary => ({
    ...state,
    identification,
  })),
  on(fromTestSummaryActions.IndependentDrivingTypeChanged, (state, {
    independentDriving,
  }): TestSummary => ({
    ...state,
    independentDriving,
  })),
  on(fromTestSummaryActions.D255Yes, (state): TestSummary => ({
    ...state,
    D255: true,
  })),
  on(fromTestSummaryActions.D255No, (state): TestSummary => ({
    ...state,
    D255: false,
  })),
  on(fromTestSummaryActions.WeatherConditionsChanged, (state, {
    weatherConditions,
  }): TestSummary => ({
    ...state,
    weatherConditions,
  })),
  on(fromMod2fromTestSummaryActions.ModeOfTransportChanged, (state, {
    modeOfTransport,
  }): TestSummary => ({
    ...state,
    modeOfTransport,
  })),
);

export const getTestSummary = createFeatureSelector<TestSummary>('testSummary');
