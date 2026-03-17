import { createSelector } from '@ngrx/store';
import { getTestReportState } from '@pages/test-report/test-report.reducer';
import { TestReportModel } from './test-report.model';

export const isRemoveFaultMode = (testReport: TestReportModel) => testReport.removeFaultMode;

export const isSeriousMode = (testReport: TestReportModel) => testReport.seriousMode;

export const isDangerousMode = (testReport: TestReportModel) => testReport.dangerousMode;

export const selectIsSeriousMode = createSelector(getTestReportState, (state) => isRemoveFaultMode(state));
export const selectIsDangerousMode = createSelector(getTestReportState, (state) => isRemoveFaultMode(state));
export const selectIsRemoveFaultMode = createSelector(getTestReportState, (state) => isRemoveFaultMode(state));
