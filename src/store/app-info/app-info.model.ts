export type AppInfoStateModel = {
  versionNumber: string;
  employeeId: string | null;
  employeeName: string;
  error?: any;
  dateConfigLoaded?: string;
  updateAvailablePresented: boolean;
};
