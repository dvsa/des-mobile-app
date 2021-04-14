import { pickBy, get } from 'lodash';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { sumManoeuvreFaults } from '@shared/helpers/faults';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { getCompetencyFaults } from '@shared/helpers/get-competency-faults';

export class FaultCountBEHelper {

  public static getVehicleChecksFaultCountCatBE = (
    vehicleChecks: CatBEUniqueTypes.VehicleChecks,
  ): VehicleChecksScore => {

    if (!vehicleChecks) {
      return { seriousFaults: 0, drivingFaults: 0 };
    }

    const showMeQuestions: QuestionResult[] = get(vehicleChecks, 'showMeQuestions', []);
    const tellMeQuestions: QuestionResult[] = get(vehicleChecks, 'tellMeQuestions', []);

    const numberOfShowMeFaults: number = showMeQuestions.filter((showMeQuestion) => {
      return showMeQuestion.outcome === CompetencyOutcome.DF;
    }).length;
    const numberOfTellMeFaults: number = tellMeQuestions.filter((tellMeQuestion) => {
      return tellMeQuestion.outcome === CompetencyOutcome.DF;
    }).length;

    const totalFaultCount: number = numberOfShowMeFaults + numberOfTellMeFaults;

    if (totalFaultCount === 5) {
      return {
        drivingFaults: 4,
        seriousFaults: 1,
      };
    }
    return {
      drivingFaults: totalFaultCount,
      seriousFaults: 0,
    };
  };

  public static getDrivingFaultSumCountCatBE = (data: CatBEUniqueTypes.TestData): number => {

    // The way how we store the driving faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const {
      drivingFaults, manoeuvres, vehicleChecks, uncoupleRecouple,
    } = data;

    let faultTotal: number = 0;
    getCompetencyFaults(drivingFaults).forEach((fault) => { faultTotal += fault.faultCount; });
    const uncoupleRecoupleHasDrivingFault = (uncoupleRecouple
      && uncoupleRecouple.fault === CompetencyOutcome.DF) ? 1 : 0;

    const result = faultTotal
      + sumManoeuvreFaults(manoeuvres, CompetencyOutcome.DF)
      + FaultCountBEHelper.getVehicleChecksFaultCountCatBE(vehicleChecks).drivingFaults
      + uncoupleRecoupleHasDrivingFault;

    return result;
  };

  public static getSeriousFaultSumCountCatBE = (data: CatBEUniqueTypes.TestData): number => {

    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const {
      seriousFaults, manoeuvres, vehicleChecks, uncoupleRecouple, eyesightTest,
    } = data;

    const seriousFaultSumOfSimpleCompetencies = Object.keys(pickBy(seriousFaults)).length;
    const vehicleCheckSeriousFaults = vehicleChecks
      ? FaultCountBEHelper.getVehicleChecksFaultCountCatBE(vehicleChecks).seriousFaults : 0;
    const uncoupleRecoupleSeriousFaults = (uncoupleRecouple && uncoupleRecouple.fault === CompetencyOutcome.S) ? 1 : 0;
    const eyesightTestSeriousFaults = (eyesightTest && eyesightTest.seriousFault) ? 1 : 0;

    const result = seriousFaultSumOfSimpleCompetencies
      + sumManoeuvreFaults(manoeuvres, CompetencyOutcome.S)
      + vehicleCheckSeriousFaults
      + eyesightTestSeriousFaults
      + uncoupleRecoupleSeriousFaults;

    return result;
  };

  public static getDangerousFaultSumCountCatBE = (data: CatBEUniqueTypes.TestData): number => {

    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { dangerousFaults, manoeuvres, uncoupleRecouple } = data;

    const dangerousFaultSumOfSimpleCompetencies = Object.keys(pickBy(dangerousFaults)).length;
    const uncoupleRecoupleDangerousFaults = (uncoupleRecouple
      && uncoupleRecouple.fault === CompetencyOutcome.D) ? 1 : 0;

    const result = dangerousFaultSumOfSimpleCompetencies
      + sumManoeuvreFaults(manoeuvres, CompetencyOutcome.D)
      + uncoupleRecoupleDangerousFaults;

    return result;
  };
}
