import {
  TestSummary,
  Circuit,
} from '@dvsa/mes-test-schema/categories/AM1';

export const getCircuit = (ts: TestSummary): Circuit => ts.circuit;
