import { pickBy, get } from 'lodash';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { sumManoeuvreFaults } from '@shared/helpers/faults';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { getCompetencyFaults } from '@shared/helpers/get-competency-faults';

type CatCVehicleCheckUnion =
    CatCUniqueTypes.VehicleChecks |
    CatC1UniqueTypes.VehicleChecks |
    CatCEUniqueTypes.VehicleChecks |
    CatC1EUniqueTypes.VehicleChecks;

export class FaultCountCHelper {

  public static getDangerousFaultSumCountCatC = (data: CatCUniqueTypes.TestData): number => {
    return FaultCountCHelper.getDangerousFaultSumCountNonTrailer(data);
  };

  public static getDangerousFaultSumCountCatCE = (data: CatCEUniqueTypes.TestData): number => {
    return FaultCountCHelper.getDangerousFaultSumCountTrailer(data);
  };

  public static getDangerousFaultSumCountCatC1E = (data: CatC1EUniqueTypes.TestData): number => {
    return FaultCountCHelper.getDangerousFaultSumCountTrailer(data);
  };

  public static getDangerousFaultSumCountCatC1 = (data: CatC1UniqueTypes.TestData): number => {
    return FaultCountCHelper.getDangerousFaultSumCountNonTrailer(data);
  };

  public static getSeriousFaultSumCountCatC = (data: CatCUniqueTypes.TestData): number => {
    return FaultCountCHelper.getSeriousFaultSumCountNonTrailer(data);
  };

  public static getSeriousFaultSumCountCatC1 = (data: CatC1UniqueTypes.TestData): number => {
    return FaultCountCHelper.getSeriousFaultSumCountNonTrailer(data);
  };

  public static getSeriousFaultSumCountCatCE = (data: CatCEUniqueTypes.TestData): number => {
    return FaultCountCHelper.getSeriousFaultSumCountTrailer(data);
  };

  public static getSeriousFaultSumCountCatC1E = (data: CatC1EUniqueTypes.TestData): number => {
    return FaultCountCHelper.getSeriousFaultSumCountTrailer(data);
  };

  public static getDrivingFaultSumCountCatC = (data: CatCUniqueTypes.TestData): number => {
    return FaultCountCHelper.getDrivingFaultSumCountNonTrailer(data);
  };

  public static getDrivingFaultSumCountCatC1 = (data: CatC1UniqueTypes.TestData): number => {
    return FaultCountCHelper.getDrivingFaultSumCountNonTrailer(data);
  };

  public static getDrivingFaultSumCountCatCE = (data: CatCEUniqueTypes.TestData): number => {
    return FaultCountCHelper.getDrivingFaultSumCountTrailer(data);
  };

  public static getDrivingFaultSumCountCatC1E = (data: CatC1EUniqueTypes.TestData): number => {
    return FaultCountCHelper.getDrivingFaultSumCountTrailer(data);
  };

  private static getVehicleChecksFaultCountNonTrailer = (
    vehicleChecks: CatCUniqueTypes.VehicleChecks | CatC1UniqueTypes.VehicleChecks,
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

  private static getVehicleChecksFaultCountTrailer = (
    vehicleChecks: CatCEUniqueTypes.VehicleChecks | CatC1EUniqueTypes.VehicleChecks,
  ): VehicleChecksScore => {

    if (!vehicleChecks) {
      return { seriousFaults: 0, drivingFaults: 0 };
    }

    const showMeQuestions: QuestionResult[] = [get(vehicleChecks, 'showMeQuestions[0]', ...[])];
    const tellMeQuestions: QuestionResult[] = [get(vehicleChecks, 'tellMeQuestions[0]', ...[])];

    const numberOfShowMeFaults: number = showMeQuestions.filter((showMeQuestion) => {
      return showMeQuestion.outcome === CompetencyOutcome.DF;
    }).length;
    const numberOfTellMeFaults: number = tellMeQuestions.filter((tellMeQuestion) => {
      return tellMeQuestion.outcome === CompetencyOutcome.DF;
    }).length;

    const totalFaultCount: number = numberOfShowMeFaults + numberOfTellMeFaults;

    if (totalFaultCount === 2) {
      return {
        drivingFaults: 1,
        seriousFaults: 1,
      };
    }
    return {
      drivingFaults: totalFaultCount,
      seriousFaults: 0,
    };
  };

  private static getDrivingFaultSumCountNonTrailer = (
    data: CatCUniqueTypes.TestData | CatC1UniqueTypes.TestData,
  ): number => {

    // The way how we store the driving faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { drivingFaults, manoeuvres, vehicleChecks } = data;

    let faultTotal: number = 0;
    getCompetencyFaults(drivingFaults).forEach((fault) => { faultTotal += fault.faultCount; });

    const result = faultTotal
      + sumManoeuvreFaults(manoeuvres, CompetencyOutcome.DF)
      + FaultCountCHelper.getVehicleChecksFaultCountNonTrailer(vehicleChecks).drivingFaults;

    return result;
  };

  private static getDrivingFaultSumCountTrailer = (
    data: CatCEUniqueTypes.TestData | CatC1EUniqueTypes.TestData,
  ): number => {

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
      + FaultCountCHelper.getVehicleChecksFaultCount(vehicleChecks).drivingFaults
      + uncoupleRecoupleHasDrivingFault;

    return result;
  };

  private static getSeriousFaultSumCountNonTrailer = (
    data: CatCUniqueTypes.TestData | CatC1UniqueTypes.TestData,
  ): number => {

    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { seriousFaults, manoeuvres, vehicleChecks } = data;

    const seriousFaultSumOfSimpleCompetencies = Object.keys(pickBy(seriousFaults)).length;
    const vehicleCheckSeriousFaults = vehicleChecks
      ? FaultCountCHelper.getVehicleChecksFaultCountNonTrailer(vehicleChecks).seriousFaults : 0;

    const result = seriousFaultSumOfSimpleCompetencies
      + sumManoeuvreFaults(manoeuvres, CompetencyOutcome.S)
      + vehicleCheckSeriousFaults;

    return result;
  };

  private static getSeriousFaultSumCountTrailer = (
    data: CatCEUniqueTypes.TestData | CatC1EUniqueTypes.TestData,
  ): number => {

    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const {
      seriousFaults, manoeuvres, vehicleChecks, uncoupleRecouple,
    } = data;

    const seriousFaultSumOfSimpleCompetencies = Object.keys(pickBy(seriousFaults)).length;
    const vehicleCheckSeriousFaults = vehicleChecks
      ? FaultCountCHelper.getVehicleChecksFaultCount(vehicleChecks).seriousFaults : 0;
    const uncoupleRecoupleSeriousFaults = (uncoupleRecouple && uncoupleRecouple.fault === CompetencyOutcome.S) ? 1 : 0;

    const result = seriousFaultSumOfSimpleCompetencies
      + sumManoeuvreFaults(manoeuvres, CompetencyOutcome.S)
      + vehicleCheckSeriousFaults
      + uncoupleRecoupleSeriousFaults;

    return result;
  };

  private static getDangerousFaultSumCountNonTrailer = (
    data: CatCUniqueTypes.TestData | CatC1UniqueTypes.TestData,
  ): number => {

    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { dangerousFaults, manoeuvres } = data;

    const dangerousFaultSumOfSimpleCompetencies = Object.keys(pickBy(dangerousFaults)).length;

    const result = dangerousFaultSumOfSimpleCompetencies
      + sumManoeuvreFaults(manoeuvres, CompetencyOutcome.D);

    return result;
  };

  private static getDangerousFaultSumCountTrailer = (
    data: CatCEUniqueTypes.TestData | CatC1EUniqueTypes.TestData,
  ): number => {

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

  static getVehicleChecksFaultCount = (
    vehicleChecks: CatCVehicleCheckUnion,
  ): VehicleChecksScore => {
    if (get(vehicleChecks, 'fullLicenceHeld')) {
      return FaultCountCHelper.getVehicleChecksFaultCountTrailer(vehicleChecks);
    }
    return FaultCountCHelper.getVehicleChecksFaultCountNonTrailer(vehicleChecks);
  };

  public static getVehicleChecksFaultCountCatC = (
    vehicleChecks: CatCUniqueTypes.VehicleChecks,
  ): VehicleChecksScore => {
    return FaultCountCHelper.getVehicleChecksFaultCountNonTrailer(vehicleChecks);
  };

  public static getVehicleChecksFaultCountCatCE = (
    vehicleChecks: CatCEUniqueTypes.VehicleChecks,
  ): VehicleChecksScore => {
    return FaultCountCHelper.getVehicleChecksFaultCountTrailer(vehicleChecks);
  };

  public static getVehicleChecksFaultCountCatC1 = (
    vehicleChecks: CatC1UniqueTypes.VehicleChecks,
  ): VehicleChecksScore => {
    return FaultCountCHelper.getVehicleChecksFaultCountNonTrailer(vehicleChecks);
  };

  public static getVehicleChecksFaultCountCatC1E = (
    vehicleChecks: CatC1EUniqueTypes.VehicleChecks,
  ): VehicleChecksScore => {
    return FaultCountCHelper.getVehicleChecksFaultCountTrailer(vehicleChecks);
  };

}
