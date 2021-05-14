export type TestReportModel = {
  seriousMode: boolean,
  dangerousMode: boolean,
  removeFaultMode: boolean,
};

export interface OverlayCallback {
  callbackMethod: () => void;
}
