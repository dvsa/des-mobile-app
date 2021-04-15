import { TestSummary } from '@dvsa/mes-test-schema/categories/CPC';

export const getAssessmentReport = (ts: TestSummary): string => ts.assessmentReport;
