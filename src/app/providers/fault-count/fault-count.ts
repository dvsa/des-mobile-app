import { Injectable } from '@angular/core';

import { VehicleChecks } from '@dvsa/mes-test-schema/categories/ADI2/partial';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';

import { sumManoeuvreFaults } from '@shared/helpers/faults';
import { FaultCountBHelper } from './cat-b/fault-count.cat-b';
import { FaultCountBEHelper } from './cat-be/fault-count.cat-be';
import { FaultCountCHelper } from './cat-c/fault-count.cat-c';
import { FaultCountDHelper } from './cat-d/fault-count.cat-d';

import { FaultCountAM1Helper } from './cat-a-mod1/fault-count.cat-a-mod1';
import { FaultCountAM2Helper } from './cat-a-mod2/fault-count.cat-a-mod2';
import { FaultCountHomeTestHelper } from './cat-home-test/fault-count.cat-home-test';
import { FaultCountADIPart2Helper } from './cat-adi-part2/fault-count.cat-adi-part2';

@Injectable()
export class FaultCountProvider {

  static getFaultSumCountErrMsg: string = 'Error getting fault sum count';

  public getDrivingFaultSumCount = (category: TestCategory, data: object): number => {
    switch (category) {
      case TestCategory.ADI2: return FaultCountADIPart2Helper.getDrivingFaultSumCountCatADIPart2(data);
      case TestCategory.B: return FaultCountBHelper.getDrivingFaultSumCountCatB(data);
      case TestCategory.BE: return FaultCountBEHelper.getDrivingFaultSumCountCatBE(data);
      case TestCategory.C1: return FaultCountCHelper.getDrivingFaultSumCountCatC1(data);
      case TestCategory.C1E: return FaultCountCHelper.getDrivingFaultSumCountCatC1E(data);
      case TestCategory.CE: return FaultCountCHelper.getDrivingFaultSumCountCatCE(data);
      case TestCategory.C: return FaultCountCHelper.getDrivingFaultSumCountCatC(data);
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1: return FaultCountAM1Helper.getRidingFaultSumCountCatAM1(data);
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2: return FaultCountAM2Helper.getRidingFaultSumCountCatAM2(data);
      case TestCategory.D1: return FaultCountDHelper.getDrivingFaultSumCountCatD1(data);
      case TestCategory.D1E: return FaultCountDHelper.getDrivingFaultSumCountCatD1E(data);
      case TestCategory.DE: return FaultCountDHelper.getDrivingFaultSumCountCatDE(data);
      case TestCategory.D: return FaultCountDHelper.getDrivingFaultSumCountCatD(data);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K: return FaultCountHomeTestHelper.getDrivingFaultSumCountCatHomeTest(data);
      default: throw new Error(`${FaultCountProvider.getFaultSumCountErrMsg}`);
    }
  };

  public getSeriousFaultSumCount = (category: TestCategory, data: object): number => {
    switch (category) {
      case TestCategory.ADI2: return FaultCountADIPart2Helper.getSeriousFaultSumCountCatADIPart2(data);
      case TestCategory.B: return FaultCountBHelper.getSeriousFaultSumCountCatB(data);
      case TestCategory.BE: return FaultCountBEHelper.getSeriousFaultSumCountCatBE(data);
      case TestCategory.C1: return FaultCountCHelper.getSeriousFaultSumCountCatC1(data);
      case TestCategory.C1E: return FaultCountCHelper.getSeriousFaultSumCountCatC1E(data);
      case TestCategory.CE: return FaultCountCHelper.getSeriousFaultSumCountCatCE(data);
      case TestCategory.C: return FaultCountCHelper.getSeriousFaultSumCountCatC(data);
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1: return FaultCountAM1Helper.getSeriousFaultSumCountCatAM1(data);
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2: return FaultCountAM2Helper.getSeriousFaultSumCountCatAM2(data);
      case TestCategory.D1: return FaultCountDHelper.getSeriousFaultSumCountCatD1(data);
      case TestCategory.D1E: return FaultCountDHelper.getSeriousFaultSumCountCatD1E(data);
      case TestCategory.DE: return FaultCountDHelper.getSeriousFaultSumCountCatDE(data);
      case TestCategory.D: return FaultCountDHelper.getSeriousFaultSumCountCatD(data);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K: return FaultCountHomeTestHelper.getSeriousFaultSumCountHomeTest(data);
      default: throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
    }
  };

  public getDangerousFaultSumCount = (category: TestCategory, data: object): number => {
    switch (category) {
      case TestCategory.ADI2: return FaultCountADIPart2Helper.getDangerousFaultSumCountCatADIPart2(data);
      case TestCategory.B: return FaultCountBHelper.getDangerousFaultSumCountCatB(data);
      case TestCategory.BE: return FaultCountBEHelper.getDangerousFaultSumCountCatBE(data);
      case TestCategory.C1: return FaultCountCHelper.getDangerousFaultSumCountCatC1(data);
      case TestCategory.C1E: return FaultCountCHelper.getDangerousFaultSumCountCatC1E(data);
      case TestCategory.CE: return FaultCountCHelper.getDangerousFaultSumCountCatCE(data);
      case TestCategory.C: return FaultCountCHelper.getDangerousFaultSumCountCatC(data);
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1: return FaultCountAM1Helper.getDangerousFaultSumCountCatAM1(data);
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2: return FaultCountAM2Helper.getDangerousFaultSumCountCatAM2(data);
      case TestCategory.D1: return FaultCountDHelper.getDangerousFaultSumCountCatD1(data);
      case TestCategory.D1E: return FaultCountDHelper.getDangerousFaultSumCountCatD1E(data);
      case TestCategory.DE: return FaultCountDHelper.getDangerousFaultSumCountCatDE(data);
      case TestCategory.D: return FaultCountDHelper.getDangerousFaultSumCountCatD(data);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K: return FaultCountHomeTestHelper.getDangerousFaultSumCountHomeTest(data);
      default: throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
    }
  };

  public getManoeuvreFaultCount = <T>(
    category: TestCategory,
    data: T,
    faultType: CompetencyOutcome,
  ): number => {

    switch (category) {
      case TestCategory.ADI2:
        if (!Array.isArray(data)) {
          return 0;
        }

        return data.reduce((acc, manoeuvre) => {
          return acc + sumManoeuvreFaults(manoeuvre, faultType);
        }, 0);
      case TestCategory.B: return sumManoeuvreFaults(data, faultType);
      case TestCategory.BE: return sumManoeuvreFaults(data, faultType);
      case TestCategory.C1:
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C: return sumManoeuvreFaults(data, faultType);
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
      case TestCategory.D: return sumManoeuvreFaults(data, faultType);
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1: return sumManoeuvreFaults(data, faultType);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H: return sumManoeuvreFaults(data, faultType);
      case TestCategory.K: return 0; // NOTE: no manoeuvres on cat K
      default: throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
    }
  };

  public getVehicleChecksFaultCount = (category: TestCategory, data: object): VehicleChecksScore => {
    switch (category) {
      case TestCategory.ADI2: return FaultCountADIPart2Helper.getVehicleChecksFaultCountCatADIPart2(data);
      case TestCategory.BE: return FaultCountBEHelper.getVehicleChecksFaultCountCatBE(data);
      case TestCategory.C: return FaultCountCHelper.getVehicleChecksFaultCountCatC(data);
      case TestCategory.C1: return FaultCountCHelper.getVehicleChecksFaultCountCatC1(data);
      case TestCategory.C1E:
      case TestCategory.CE: return FaultCountCHelper.getVehicleChecksFaultCount(data);
      case TestCategory.D1: return FaultCountDHelper.getVehicleChecksFaultCountCatD1(data);
      case TestCategory.D1E: return FaultCountDHelper.getVehicleChecksFaultCountCatD1E(data);
      case TestCategory.DE: return FaultCountDHelper.getVehicleChecksFaultCountCatDE(data);
      case TestCategory.D: return FaultCountDHelper.getVehicleChecksFaultCountCatD(data);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K: return FaultCountHomeTestHelper.getVehicleChecksFaultCountCatHomeTest(data);
      default: throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
    }
  };

  public getSafetyAndBalanceFaultCount = (category: TestCategory, data: object): SafetyQuestionsScore => {
    switch (category) {
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2: return FaultCountAM2Helper.getSafetyAndBalanceFaultCountCatAM2(data);
      default: throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
    }
  };

  public getTellMeFaultCount = (category: TestCategory, data: VehicleChecks): VehicleChecksScore => {
    switch (category) {
      case TestCategory.ADI2: return FaultCountADIPart2Helper.getTellMeFaultCount(data);
      default: throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
    }
  };

  public getShowMeFaultCount = (category: TestCategory, data: VehicleChecks): VehicleChecksScore => {
    switch (category) {
      case TestCategory.ADI2: return FaultCountADIPart2Helper.getShowMeFaultCount(data);
      default: throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
    }
  };
}
