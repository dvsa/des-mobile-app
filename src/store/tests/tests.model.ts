import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories/index';
import { TestStatus } from './test-status/test-status.model';

export interface CurrentTest {
  slotId: string;
}

export interface TestsModel {
  currentTest: CurrentTest;
  startedTests: { [slotId: string]: TestResultSchemasUnion };
  testStatus: { [slotId: string]: TestStatus };
}
