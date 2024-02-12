import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ColourEnum, SelectableDateRange } from '@providers/examiner-records/examiner-records';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';

export type ExaminerRecordStateModel = {
  cachedTests: ExaminerRecordModel[];
  showData: boolean;
  colourScheme: ColourEnum;
  dateFilter: SelectableDateRange;
  locationFilter: number;
  categoryFilter: TestCategory;
  isLoading?: boolean;
  lastUpdatedTime: string;
};
