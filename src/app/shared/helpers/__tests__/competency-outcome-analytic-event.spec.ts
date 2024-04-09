import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { AnalyticsEvents } from '@providers/analytics/analytics.model';
import { ValidFaultTypes } from '@pages/office/components/fault-comment/fault-comment';
import {
  CompetencyOutcomeAnalyticEvent,
  CompetencyOutcomeGA4Event,
} from '@shared/helpers/competency-outcome-analytic-event';

describe('CompetencyOutcomeAnalyticEvent', () => {
  it('should return REMOVE_DANGEROUS_FAULT when faultLevel is D', () => {
    expect(CompetencyOutcomeAnalyticEvent(CompetencyOutcome.D)).toBe(AnalyticsEvents.REMOVE_DANGEROUS_FAULT);
  });

  it('should return REMOVE_SERIOUS_FAULT when faultLevel is S', () => {
    expect(CompetencyOutcomeAnalyticEvent(CompetencyOutcome.S)).toBe(AnalyticsEvents.REMOVE_SERIOUS_FAULT);
  });

  it('should return REMOVE_DRIVING_FAULT for any other faultLevel', () => {
    expect(CompetencyOutcomeAnalyticEvent(CompetencyOutcome.DF)).toBe(AnalyticsEvents.REMOVE_DRIVING_FAULT);
  });
});

describe('CompetencyOutcomeGA4Event', () => {
  it('should return DANGEROUS when faultLevel is D', () => {
    expect(CompetencyOutcomeGA4Event(CompetencyOutcome.D)).toBe(ValidFaultTypes.DANGEROUS);
  });

  it('should return SERIOUS when faultLevel is S', () => {
    expect(CompetencyOutcomeGA4Event(CompetencyOutcome.S)).toBe(ValidFaultTypes.SERIOUS);
  });

  it('should return DRIVING for any other faultLevel', () => {
    expect(CompetencyOutcomeGA4Event(CompetencyOutcome.DF)).toBe(ValidFaultTypes.DRIVING);
  });
});
