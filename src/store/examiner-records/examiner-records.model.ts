import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { ColourEnum } from '@providers/examiner-records/examiner-records';

export type ExaminerRecordStateModel = {
  cachedRecords: ExaminerRecordModel[];
  colourScheme: ColourEnum;
  isLoading?: boolean;
  lastUpdatedTime: string;
};
