import {CatBUniqueTypes} from '@dvsa/mes-test-schema/categories/B';
import {sumManoeuvreFaults} from '@shared/helpers/faults';
import {getCompetencyFaults} from '@shared/helpers/get-competency-faults';
import {CompetencyOutcome} from '@shared/models/competency-outcome';
import {pickBy} from 'lodash-es';

export class FaultCountBHelper {
  public static getDrivingFaultSumCountCatB = (data: CatBUniqueTypes.TestData): number => {
    // The way how we store the driving faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { drivingFaults, manoeuvres, controlledStop, vehicleChecks } = data;
    let faultTotal = 0;
    getCompetencyFaults(drivingFaults).forEach((fault) => {
      faultTotal += fault.faultCount;
    });

    const controlledStopHasDrivingFault = controlledStop && controlledStop.fault === CompetencyOutcome.DF ? 1 : 0;

    return faultTotal +
      sumManoeuvreFaults(manoeuvres, CompetencyOutcome.DF) +
      FaultCountBHelper.getVehicleChecksFaultCountCatB(vehicleChecks) +
      controlledStopHasDrivingFault;
  };

  public static getSeriousFaultSumCountCatB = (data: CatBUniqueTypes.TestData): number => {
    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { seriousFaults, manoeuvres, controlledStop, vehicleChecks, eyesightTest } = data;

    const seriousFaultSumOfSimpleCompetencies = Object.keys(pickBy(seriousFaults)).length;
    const vehicleCheckSeriousFaults = vehicleChecks?.showMeQuestion?.outcome === CompetencyOutcome.S ? 1 : 0;
    const controlledStopSeriousFaults = controlledStop?.fault === CompetencyOutcome.S ? 1 : 0;
    const eyesightTestSeriousFaults = eyesightTest?.seriousFault ? 1 : 0;

    return (
      seriousFaultSumOfSimpleCompetencies +
      sumManoeuvreFaults(manoeuvres, CompetencyOutcome.S) +
      vehicleCheckSeriousFaults +
      controlledStopSeriousFaults +
      eyesightTestSeriousFaults
    );
  };

  public static getDangerousFaultSumCountCatB = (data: CatBUniqueTypes.TestData): number => {
    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { dangerousFaults, manoeuvres, controlledStop, vehicleChecks } = data;

    const dangerousFaultSumOfSimpleCompetencies = Object.keys(pickBy(dangerousFaults)).length;
    const vehicleCheckDangerousFaults =
      vehicleChecks && vehicleChecks.showMeQuestion.outcome === CompetencyOutcome.D ? 1 : 0;
    const controlledStopDangerousFaults = controlledStop && controlledStop.fault === CompetencyOutcome.D ? 1 : 0;

    return dangerousFaultSumOfSimpleCompetencies +
      sumManoeuvreFaults(manoeuvres, CompetencyOutcome.D) +
      vehicleCheckDangerousFaults +
      controlledStopDangerousFaults;
  };

  private static getVehicleChecksFaultCountCatB = (vehicleChecks: CatBUniqueTypes.VehicleChecks): number => {
    if (!vehicleChecks) {
      return 0;
    }

    const { showMeQuestion, tellMeQuestion } = vehicleChecks;

    if (showMeQuestion.outcome === CompetencyOutcome.S || showMeQuestion.outcome === CompetencyOutcome.D) {
      return 0;
    }

    if (showMeQuestion.outcome === CompetencyOutcome.DF || tellMeQuestion.outcome === CompetencyOutcome.DF) {
      return 1;
    }

    return 0;
  };
}
