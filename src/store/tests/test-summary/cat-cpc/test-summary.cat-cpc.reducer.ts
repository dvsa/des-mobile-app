import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { TestSummary } from '@dvsa/mes-test-schema/categories/CPC';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as fromCPCTestSummaryActions from './test-summary.cat-cpc.actions';
import * as fromTestSummaryActions from '../test-summary.actions';

export const initialState: TestSummary = {
  candidateDescription: null,
  identification: 'Licence',
  D255: false,
  debriefWitnessed: null,
  additionalInformation: null,
  assessmentReport: null,
  trueLikenessToPhoto: null,
};

export const testSummaryCPCReducer = createReducer(
  initialState,
  on(testSummaryActions.TrueLikenessToPhotoChanged, (state, { trueLikeness }): TestSummary => ({
    ...state,
    trueLikenessToPhoto: trueLikeness,
  })),
  on(fromTestSummaryActions.CandidateDescriptionChanged, (state, { candidateDescription }): TestSummary => ({
    ...state,
    candidateDescription,
  })),
  on(fromTestSummaryActions.IdentificationUsedChanged, (state, { identification }): TestSummary => ({
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
  on(fromCPCTestSummaryActions.AssessmentReportChanged, (state, { assessmentReport }): TestSummary => ({
    ...state,
    assessmentReport,
  })),
);

export const getTestSummary = createFeatureSelector<TestSummary>('testSummary');
