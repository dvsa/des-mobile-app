import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { TestSummary } from '@dvsa/mes-test-schema/categories/ADI3';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as fromTestSummaryActions from '../test-summary.actions';
import * as fromAdi3TestSummaryActions from './test-summary.cat-adi-part3.actions';

export const initialState: TestSummary = {
  candidateDescription: null,
  identification: null,
  debriefWitnessed: null,
  additionalInformation: null,
  trueLikenessToPhoto: null,
  weatherConditions: [],
};

export const testSummaryADIPart3Reducer = createReducer(
  initialState,
  on(testSummaryActions.TrueLikenessToPhotoChanged, (state, { trueLikeness }): TestSummary => ({
    ...state,
    trueLikenessToPhoto: trueLikeness,
  })),
  on(fromTestSummaryActions.CandidateDescriptionChanged, (state, { candidateDescription }): TestSummary => ({
    ...state,
    candidateDescription,
  })),
  on(fromAdi3TestSummaryActions.IdentificationUsedChanged, (state, { identification }): TestSummary => ({
    ...state,
    identification,
  })),
  on(fromTestSummaryActions.AdditionalInformationChanged, (state, { additionalInformation }): TestSummary => ({
    ...state,
    additionalInformation,
  })),
  on(fromTestSummaryActions.DebriefWitnessed, (state): TestSummary => ({
    ...state,
    debriefWitnessed: true,
  })),
  on(fromTestSummaryActions.DebriefUnWitnessed, (state): TestSummary => ({
    ...state,
    debriefWitnessed: false,
  })),
  on(testSummaryActions.WeatherConditionsChanged, (state, { weatherConditions }): TestSummary => ({
    ...state,
    weatherConditions,
  })),
);

export const getTestSummary = createFeatureSelector<TestSummary>('testSummary');
