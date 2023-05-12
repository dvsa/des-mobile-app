import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { AnalyticsEvents } from '@providers/analytics/analytics.model';

export const CompetencyOutcomeAnalyticEvent = (faultLevel: CompetencyOutcome): string => {
  switch (faultLevel) {
    case CompetencyOutcome.D:
      return AnalyticsEvents.REMOVE_DANGEROUS_FAULT;
    case CompetencyOutcome.S:
      return AnalyticsEvents.REMOVE_SERIOUS_FAULT;
    default:
      return AnalyticsEvents.REMOVE_DRIVING_FAULT;
  }
};
