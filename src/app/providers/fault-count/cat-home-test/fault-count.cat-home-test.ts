import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { sumManoeuvreFaults } from '@shared/helpers/faults';
import { getCompetencyFaults } from '@shared/helpers/get-competency-faults';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { get, has, pickBy } from 'lodash-es';

type HomeTestData =
  | CatFUniqueTypes.TestData
  | CatGUniqueTypes.TestData
  | CatHUniqueTypes.TestData
  | CatKUniqueTypes.TestData;

type HomeVehicleChecks =
  | CatFUniqueTypes.VehicleChecks
  | CatGUniqueTypes.VehicleChecks
  | CatHUniqueTypes.VehicleChecks
  | CatKUniqueTypes.VehicleChecks;

export class FaultCountHomeTestHelper {
  public static getManoeuvreCountIfAny(data: HomeTestData, competencyType: CompetencyOutcome): number {
    let manoeuvreCount = 0;
    const hasManoeuvre: boolean = has(data, 'manoeuvres');
    if (hasManoeuvre) {
      const manoeuvres = get(data, 'manoeuvres', {});
      manoeuvreCount = sumManoeuvreFaults(manoeuvres, competencyType);
    }
    return manoeuvreCount;
  }

  public static getDrivingFaultSumCountCatHomeTest = (data: HomeTestData): number => {
    // The way how we store the driving faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { drivingFaults, controlledStop, vehicleChecks, highwayCodeSafety } = data;
    let faultTotal = 0;
    getCompetencyFaults(drivingFaults).forEach((fault) => {
      faultTotal += fault.faultCount;
    });

    const controlledStopHasDrivingFault = controlledStop?.fault === CompetencyOutcome.DF ? 1 : 0;
    const hcodeSafetyHasDrivingFault = highwayCodeSafety?.drivingFault ? 1 : 0;
    return (
      faultTotal +
      FaultCountHomeTestHelper.getManoeuvreCountIfAny(data, CompetencyOutcome.DF) +
      FaultCountHomeTestHelper.getVehicleChecksFaultCountCatHomeTest(vehicleChecks).drivingFaults +
      controlledStopHasDrivingFault +
      hcodeSafetyHasDrivingFault
    );
  };

  public static getSeriousFaultSumCountHomeTest = (data: HomeTestData): number => {
    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { seriousFaults, controlledStop, eyesightTest, highwayCodeSafety } = data;

    const seriousFaultSumOfSimpleCompetencies = Object.keys(pickBy(seriousFaults)).length;
    const eyesightTestSeriousFaults = eyesightTest?.seriousFault ? 1 : 0;
    const controlledStopSeriousFaults = controlledStop?.fault === CompetencyOutcome.S ? 1 : 0;
    const hcodeSafetyHasSeriousFault = highwayCodeSafety?.seriousFault ? 1 : 0;

    return (
      seriousFaultSumOfSimpleCompetencies +
      FaultCountHomeTestHelper.getManoeuvreCountIfAny(data, CompetencyOutcome.S) +
      controlledStopSeriousFaults +
      hcodeSafetyHasSeriousFault +
      eyesightTestSeriousFaults
    );
  };

  public static getDangerousFaultSumCountHomeTest = (data: HomeTestData): number => {
    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { dangerousFaults, controlledStop } = data;

    const dangerousFaultSumOfSimpleCompetencies = Object.keys(pickBy(dangerousFaults)).length;
    const controlledStopDangerousFaults = controlledStop && controlledStop.fault === CompetencyOutcome.D ? 1 : 0;

    return (
      dangerousFaultSumOfSimpleCompetencies +
      FaultCountHomeTestHelper.getManoeuvreCountIfAny(data, CompetencyOutcome.D) +
      controlledStopDangerousFaults
    );
  };

  public static getVehicleChecksFaultCountCatHomeTest = (vehicleChecks: HomeVehicleChecks): VehicleChecksScore => {
    if (!vehicleChecks) {
      return {
        seriousFaults: 0,
        drivingFaults: 0,
      };
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
    if (totalFaultCount > 0) {
      return {
        drivingFaults: 1,
        seriousFaults: 0,
      };
    }

    return {
      drivingFaults: 0,
      seriousFaults: 0,
    };
  };
}
