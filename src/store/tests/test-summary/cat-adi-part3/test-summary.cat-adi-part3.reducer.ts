import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { TestSummary } from '@dvsa/mes-test-schema/categories/ADI3';
import * as fromTestSummaryActions from '../test-summary.actions';

export const initialState: TestSummary = {
  debriefWitnessed: null,
  additionalInformation: null,
};

export const testSummaryADIPart3Reducer = createReducer(
  initialState,
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
);

export const getTestSummary = createFeatureSelector<TestSummary>('testSummary');
