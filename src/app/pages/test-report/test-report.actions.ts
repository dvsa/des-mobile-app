import { createAction } from '@ngrx/store';

export const TestReportViewDidEnter = createAction(
  '[TestReportPage] Test Report did enter',
);

// The aim of isUserGenerated in the actions below is so we know if we should track the event in analytics.
// by default we don't as most of the time we programatically toggling the mode which we don't want to record
export const ToggleRemoveFaultMode = createAction(
  '[TestReportPage] Toggle Remove Fault Mode',
  (isUserGenerated: boolean = false) => ({ isUserGenerated }),
);

export const ToggleSeriousFaultMode = createAction(
  '[TestReportPage] Toggle Serious Fault Mode',
  (isUserGenerated: boolean = false) => ({ isUserGenerated }),
);

export const ToggleDangerousFaultMode = createAction(
  '[TestReportPage] Toggle Dangerous Fault Mode',
  (isUserGenerated: boolean = false) => ({ isUserGenerated }),
);

export const ResetFaultMode = createAction(
  '[TestReportPage] Reset Fault Mode',
);

export const CalculateTestResult = createAction(
  '[TestResultPage] Calculate Test Result',
);

export const TerminateTestFromTestReport = createAction(
  '[TestReportPage] Terminate test',
);

export const ReturnToTest = createAction(
  '[TestReportPage] Return to Test',
);

export const StartTimer = createAction('[TestReportPage] Start Timer');

export type Types =
  | typeof TestReportViewDidEnter
  | typeof ToggleSeriousFaultMode
  | typeof ToggleDangerousFaultMode
  | typeof ToggleRemoveFaultMode
  | typeof CalculateTestResult
  | typeof TerminateTestFromTestReport
  | typeof StartTimer;
