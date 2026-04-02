import { TestData as CatADI3TestData, LessonPlanning, RiskManagement } from '@dvsa/mes-test-schema/categories/ADI3';
import { createSelector } from '@ngrx/store';
import { selectTestData } from '@store/tests/test-data/common/test-data.selector';

export const getRiskManagementScore = (riskManagement: RiskManagement) => riskManagement.score;

export const selectRiskManagement = createSelector(
  selectTestData,
  (test): LessonPlanning => (test as CatADI3TestData).riskManagement
);
