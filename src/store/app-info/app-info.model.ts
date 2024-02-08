export type AppInfoStateModel = {
  versionNumber: string;
  employeeId: string | null;
  employeeName: string;
  error?: unknown;
  dateConfigLoaded?: string;
  updateAvailablePresented: boolean;
};
