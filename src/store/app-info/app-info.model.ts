import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ColourEnum, SelectableDateRange } from '@providers/examiner-records/examiner-records';

export type AppInfoStateModel = {
  versionNumber: string;
  employeeId: string | null;
  employeeName: string;
  error?: unknown;
  dateConfigLoaded?: string;
  updateAvailablePresented: boolean;
  examinerRecords: {
    cachedTests: string;
    showData: boolean;
    colourScheme: ColourEnum;
    dateFilter: SelectableDateRange;
    locationFilter: number;
    categoryFilter: TestCategory;
    isLoading?: boolean;
  }
};
