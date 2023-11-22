import { ColourEnum } from '@pages/examiner-stats/examiner-stats.page';

export type AppInfoStateModel = {
  versionNumber: string;
  employeeId: string | null;
  employeeName: string;
  error?: unknown;
  dateConfigLoaded?: string;
  updateAvailablePresented: boolean;
  examinerStats: {
    hideCharts: boolean;
    colourScheme: ColourEnum;
  }
};
