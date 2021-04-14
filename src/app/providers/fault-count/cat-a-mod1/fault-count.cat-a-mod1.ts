import { TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { pickBy, get } from 'lodash';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { getCompetencyFaults } from '@shared/helpers/get-competency-faults';

export class FaultCountAM1Helper {

  public static getDangerousFaultSumCountCatAM1 = (data: TestData): number => {

    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { singleFaultCompetencies, dangerousFaults } = data;

    const dangerousFaultSumOfSimpleCompetencies = Object.keys(pickBy(dangerousFaults)).length;
    const controlledStopDangerousFaults = (
      get(singleFaultCompetencies, 'controlledStop') === CompetencyOutcome.D) ? 1 : 0;
    const useOfStandDangerousFaults = (
      get(singleFaultCompetencies, 'useOfStand') === CompetencyOutcome.D) ? 1 : 0;
    const manualHandlingDangerousFaults = (
      get(singleFaultCompetencies, 'manualHandling') === CompetencyOutcome.D) ? 1 : 0;
    const slalomDangerousFaults = (
      get(singleFaultCompetencies, 'slalom') === CompetencyOutcome.D) ? 1 : 0;
    const slowControlDangerousFaults = (
      get(singleFaultCompetencies, 'slowControl') === CompetencyOutcome.D) ? 1 : 0;
    const uTurnDangerousFaults = (
      get(singleFaultCompetencies, 'uTurn') === CompetencyOutcome.D) ? 1 : 0;
    const emergencyStopDangerousFaults = (
      get(singleFaultCompetencies, 'emergencyStop') === CompetencyOutcome.D) ? 1 : 0;
    const avoidanceDangerousFaults = (
      get(singleFaultCompetencies, 'avoidance') === CompetencyOutcome.D) ? 1 : 0;

    const result = dangerousFaultSumOfSimpleCompetencies
      + controlledStopDangerousFaults
      + useOfStandDangerousFaults
      + manualHandlingDangerousFaults
      + slalomDangerousFaults
      + slowControlDangerousFaults
      + uTurnDangerousFaults
      + emergencyStopDangerousFaults
      + avoidanceDangerousFaults;

    return result;
  };

  public static getSeriousFaultSumCountCatAM1 = (data: TestData): number => {

    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const {
      seriousFaults, singleFaultCompetencies, emergencyStop, avoidance,
    } = data;

    const seriousFaultSumOfSimpleCompetencies = Object.keys(pickBy(seriousFaults)).length;
    const controlledStopSeriousFaults = (
      get(singleFaultCompetencies, 'controlledStop') === CompetencyOutcome.S) ? 1 : 0;
    const useOfStandSeriousFaults = (
      get(singleFaultCompetencies, 'useOfStand') === CompetencyOutcome.S) ? 1 : 0;
    const manualHandlingSeriousFaults = (
      get(singleFaultCompetencies, 'manualHandling') === CompetencyOutcome.S) ? 1 : 0;
    const slalomSeriousFaults = (
      get(singleFaultCompetencies, 'slalom') === CompetencyOutcome.S) ? 1 : 0;
    const slowControlSeriousFaults = (
      get(singleFaultCompetencies, 'slowControl') === CompetencyOutcome.S) ? 1 : 0;
    const uTurnSeriousFaults = (
      get(singleFaultCompetencies, 'uTurn') === CompetencyOutcome.S) ? 1 : 0;
    const emergencyStopSeriousFaults = (
      get(singleFaultCompetencies, 'emergencyStop') === CompetencyOutcome.S) ? 1 : 0;
    const avoidanceSeriousFaults = (
      get(singleFaultCompetencies, 'avoidance') === CompetencyOutcome.S) ? 1 : 0;
    const emergencyStopSpeedRequirementSeriousFaults = (
      get(emergencyStop, 'outcome') === CompetencyOutcome.S) ? 1 : 0;
    const avoidanceSpeedRequirementSeriousFaults = (
      get(avoidance, 'outcome') === CompetencyOutcome.S) ? 1 : 0;

    const result = seriousFaultSumOfSimpleCompetencies
      + controlledStopSeriousFaults
      + useOfStandSeriousFaults
      + manualHandlingSeriousFaults
      + slalomSeriousFaults
      + slowControlSeriousFaults
      + uTurnSeriousFaults
      + emergencyStopSeriousFaults
      + avoidanceSeriousFaults
      + emergencyStopSpeedRequirementSeriousFaults
      + avoidanceSpeedRequirementSeriousFaults;

    return result;
  };

  public static getRidingFaultSumCountCatAM1 = (data: TestData): number => {

    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { drivingFaults, singleFaultCompetencies } = data;

    const drivingFaultSumOfSimpleCompetencies = getCompetencyFaults(drivingFaults)
      .reduce(((res, faultSummary) => res + faultSummary.faultCount), 0);
    const controlledStopDrivingFaults = (
      get(singleFaultCompetencies, 'controlledStop') === CompetencyOutcome.DF) ? 1 : 0;
    const useOfStandDrivingFaults = (
      get(singleFaultCompetencies, 'useOfStand') === CompetencyOutcome.DF) ? 1 : 0;
    const manualHandlingDrivingFaults = (
      get(singleFaultCompetencies, 'manualHandling') === CompetencyOutcome.DF) ? 1 : 0;
    const slalomDrivingFaults = (
      get(singleFaultCompetencies, 'slalom') === CompetencyOutcome.DF) ? 1 : 0;
    const slowControlDrivingFaults = (
      get(singleFaultCompetencies, 'slowControl') === CompetencyOutcome.DF) ? 1 : 0;
    const uTurnDrivingFaults = (
      get(singleFaultCompetencies, 'uTurn') === CompetencyOutcome.DF) ? 1 : 0;
    const emergencyStopRidingFaults = (
      get(singleFaultCompetencies, 'emergencyStop') === CompetencyOutcome.DF) ? 1 : 0;
    const avoidanceRidingFaults = (
      get(singleFaultCompetencies, 'avoidance') === CompetencyOutcome.DF) ? 1 : 0;

    const result = drivingFaultSumOfSimpleCompetencies
      + controlledStopDrivingFaults
      + useOfStandDrivingFaults
      + manualHandlingDrivingFaults
      + slalomDrivingFaults
      + slowControlDrivingFaults
      + uTurnDrivingFaults
      + emergencyStopRidingFaults
      + avoidanceRidingFaults;

    return result;
  };
}
