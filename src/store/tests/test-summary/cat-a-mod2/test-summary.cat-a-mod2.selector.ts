import { ModeOfTransport, TestSummary } from '@dvsa/mes-test-schema/categories/AM2';

export const getModeOfTransport = (ts: TestSummary): ModeOfTransport => ts.modeOfTransport;
