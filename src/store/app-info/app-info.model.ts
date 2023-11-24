import { ColourEnum, SelectableDateRange } from '@pages/examiner-stats/examiner-stats.page';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

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
    dateFilter: SelectableDateRange;
    locationFilter: number;
    categoryFilter: TestCategory;
  }
};
