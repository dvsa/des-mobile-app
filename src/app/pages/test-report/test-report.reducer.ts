import { createFeatureSelector, createReducer, on } from '@ngrx/store';

import * as testReportActions from './test-report.actions';
import { TestReportModel } from './test-report.model';

export const initialState: TestReportModel = {
  seriousMode: false,
  dangerousMode: false,
  removeFaultMode: false,
};

export const testReportReducer = createReducer(
  initialState,
  on(testReportActions.ToggleRemoveFaultMode, (state) => ({
    ...state,
    removeFaultMode: !state.removeFaultMode,
  })),
  on(testReportActions.ToggleSeriousFaultMode, (state) => ({
    ...state,
    seriousMode: !state.seriousMode,
  })),
  on(testReportActions.ToggleDangerousFaultMode, (state) => ({
    ...state,
    dangerousMode: !state.dangerousMode,
  })),
  on(testReportActions.ResetFaultMode, (state) => ({
    ...state,
    removeFaultMode: false,
    seriousMode: false,
    dangerousMode: false,
  })),
);

export const getTestReportState = createFeatureSelector<TestReportModel>('testReport');
