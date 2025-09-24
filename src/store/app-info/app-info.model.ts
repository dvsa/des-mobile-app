import {AuthResult} from '@ionic-enterprise/auth';

export type AppInfoStateModel = {
  versionNumber: string;
  employeeId: string | null;
  employeeName: string;
  authResult: AuthResult;
  error?: unknown;
  dateConfigLoaded?: string;
  updateAvailablePresented: boolean;
};
