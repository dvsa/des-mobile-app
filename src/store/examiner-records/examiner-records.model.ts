import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ColourEnum, SelectableDateRange } from '@providers/examiner-records/examiner-records';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';

export type ExaminerRecordStateModel = {
  cachedRecords: ExaminerRecordModel[];
  showData: boolean;
  colourScheme: ColourEnum;
  dateFilter: SelectableDateRange;
  locationFilter: TestCentre;
  categoryFilter: TestCategory;
  isLoading?: boolean;
  lastUpdatedTime: string;
};
