import { RiskManagement } from '@dvsa/mes-test-schema/categories/ADI3';

export const getRiskManagementScore = (riskManagement: RiskManagement) => riskManagement.score;
