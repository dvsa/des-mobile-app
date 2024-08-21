import { ValidFaultTypes } from '@pages/office/components/fault-comment/fault-comment';
import { AnalyticsEvents } from '@providers/analytics/analytics.model';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

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

export const CompetencyOutcomeGA4Event = (faultLevel: CompetencyOutcome): string => {
  switch (faultLevel) {
    case CompetencyOutcome.D:
      return ValidFaultTypes.DANGEROUS;
    case CompetencyOutcome.S:
      return ValidFaultTypes.SERIOUS;
    default:
      return ValidFaultTypes.DRIVING;
  }
};
